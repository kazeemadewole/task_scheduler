import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { tokenDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/models/users.entity';
import { join } from 'path';
import { readFileSync } from 'fs';
import { UserResetPassword } from '../user/models/userResetPassword.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, encode, generateOtp, validPhoneNumber } from '../utils/helper';
import { RolesService } from '../roles/roles.service';
import { UserEmailVerification } from '../user/models/useremailverification.entity';
import {
  AdminInviteResponse,
  AdminSignUpResponse,
  EmailVerificationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  ResetPasswordResponse,
} from './dto/response';
import {
  AdminCreateUserDto,
  CreateSuperAdminUser,
  CreateUser,
  EmailVerificationDto,
  ResetPasswordInput,
} from './dto/inputs';
import { ROLESENUM } from '../base/base.entity';
import { InvitationToken } from '../user/models/invitationToken.entity';
import { v4 as uuidv4 } from 'uuid';
import { OtpEntity } from '../otp/models/otp.entity';
import { OtpStatus, OtpType, OtpUsage } from '../utils/enums';
import BaseService from '../base/base.service';
import { GetUserBaseResponse } from 'src/base/dto/response/baseUserResponse.dto';

@Injectable()
export class AuthService extends BaseService {
  private log: Logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserResetPassword)
    private readonly userResetPasswordRepository: Repository<UserResetPassword>,
    @InjectRepository(UserEmailVerification)
    private readonly userEmailVerificationRepository: Repository<UserEmailVerification>,
    @InjectRepository(InvitationToken)
    private readonly adminInvitationTokenRepository: Repository<InvitationToken>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private config: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private readonly roleService: RolesService,
  ) {
    super();
  }

  async createUser(
    createUserInput: CreateUser,
    role?: ROLESENUM,
  ): Promise<any> {
    try {
      if (createUserInput.termsAndCondition == false) {
        throw new HttpException(
          'Kindly Accept Cloudbucks Terms and Condition',
          HttpStatus.FORBIDDEN,
        );
      }

      if (!role) {
        role = ROLESENUM.USER;
      }

      if (!validPhoneNumber(createUserInput.phone)) {
        throw new HttpException(
          `This phone number ${createUserInput.phone} is invalid, please provide your phone number in the format 0XXXXXXXXXX`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const roleData = await this.roleService.getRoleByName(role);
      if (!roleData) {
        throw new HttpException('Invalid role', HttpStatus.FORBIDDEN);
      }
      const hashedPassword = await this.hashPassword(createUserInput.password);
      const data = {
        ...createUserInput,
        password: hashedPassword,
      };

      const newUser = this.userRepository.create(data);
      newUser.role = roleData;
      const createdUser = await this.userRepository.save(newUser);
      const otpRecord = await this.initiateOtp({
        userId: createdUser.id,
        type: OtpType.PIN,
        usage: OtpUsage.EMAIL_VERIFICATION,
      });

      return this.sendSuccessResponse(
        {
          status: true,
          otpKey: otpRecord.payload.otpKey,
          message: 'OTP has been successfully sent to your email address',
        },
        '',
      );
    } catch (error) {
      return this.sendFailedResponse(
        {
          status: false,
          otpKey: null,
          message: error.message,
        },
        '',
      );
    }
  }

  async initiateOtp(payload: any) {
    try {
      const { otp, timestamp, expiration_time } = await generateOtp();

      const createVerification = this.otpRepository.create({
        otp,
        type: payload.type,
        usage: payload.usage,
        user_id: payload.userId,
        expirationTime: expiration_time,
      });

      const OtpRecord = await this.otpRepository.save(createVerification);

      const details = {
        timestamp,
        type: payload.type,
        otp_id: OtpRecord.id,
      };

      const otpKey = await encode(JSON.stringify(details));
      // Encrypt the details object

      return this.sendSuccessResponse(
        {
          status: true,
          otpKey,
          message: `successfull`,
        },
        '',
      );
    } catch (error) {
      return this.sendFailedResponse(
        {
          status: false,
          message: error.message,
        },
        '',
      );
    }
  }

  async resendResetPinOtp(payload: any): Promise<any> {
    try {
      const otp_key_info = JSON.parse(await decode(payload.otpKey));

      // check if otp is valid (unused and not expired)
      // get otp info

      const otpObj = await this.otpRepository.findOne(otp_key_info.otp_id);

      const now = new Date();
      const targetDate = new Date(otp_key_info.timestamp);

      const differenceInSeconds = (now.getTime() - targetDate.getTime()) / 1000;

      if (differenceInSeconds <= 120) {
        return this.sendSuccessResponse(
          {
            userId: otpObj.user_id,
            type: otpObj.type,
            usage: otpObj.usage,
          },
          '',
        );
      } else {
        return this.sendSuccessResponse({}, '');
      }
    } catch (error) {}
  }

  async createAdminUser(
    createUserInput: AdminCreateUserDto,
  ): Promise<AdminSignUpResponse> {
    try {
      const getToken = await this.adminInvitationTokenRepository.findOne({
        where: {
          token: createUserInput.invitationToken,
          email: createUserInput.email,
        },
      });

      if (!getToken) {
        throw new HttpException(
          'Invalid invitation token provided',
          HttpStatus.FORBIDDEN,
        );
      }
      const roleData = await this.roleService.getRoleByName(ROLESENUM.ADMIN);
      if (!roleData) {
        throw new HttpException('Invalid role', HttpStatus.FORBIDDEN);
      }
      const hashedPassword = await this.hashPassword(createUserInput.password);
      const data = {
        ...createUserInput,
        password: hashedPassword,
        email_verified: true,
      };

      const newUser = this.userRepository.create(data);
      newUser.role = roleData;
      const createdUser = await this.userRepository.save(newUser);

      await this.adminInvitationTokenRepository.delete({ id: getToken.id });
      return {
        status: true,
        message: 'Admin successfully created',
        user: createdUser as unknown as GetUserBaseResponse,
      };
    } catch (error) {
      if (error.code == 23505) {
        try {
          throw new ConflictException(error.detail);
        } catch (error) {
          return {
            status: false,
            message: error.message,
            user: null,
          };
        }
      }
      return {
        status: false,
        message: error.message,
        user: null,
      };
    }
  }

  async verify_email(
    email_verification_details: EmailVerificationDto,
  ): Promise<EmailVerificationResponse> {
    const verifyEmail = await this.userService.verify_email(
      email_verification_details,
    );

    if (!verifyEmail.status) {
      return {
        status: false,
        message: verifyEmail.message,
        user: null,
        role: null,
        accessToken: null,
      };
    }
    const payload = {
      id: verifyEmail.user.id,
      first_name: verifyEmail.user.firstName,
      last_name: verifyEmail.user.lastName,
      role: verifyEmail.user.role?.name,
    };

    const token = await this.generateTokens(payload);
    delete verifyEmail?.user?.password;
    return {
      status: true,
      message: verifyEmail.message,
      user: verifyEmail.user,
      role: verifyEmail.user?.role,
      ...token,
    };
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, Number(this.config.get('BCRYPT_SALT')));
  }

  async validateUserPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatched = await bcrypt.compare(password, hashPassword);
    return isMatched;
  }

  async generateTokens(payload: any): Promise<tokenDto> {
    const user = { user: { ...payload } };
    const accessToken = await this.jwtService.signAsync(user, {
      secret: this.config.get<string>('AT_SECRET'),
      issuer: 'taskScheduler',
      expiresIn: '2hr',
    });
    const tokens = {
      accessToken,
    };
    return tokens;
  }

  async validateUser(user_name: string, password: string): Promise<any> {
    const user = await this.userService.findByMail(user_name);
    if (!user) {
      return { status: false, message: 'user not found' };
    }

    const isPasswordMatch = await this.validateUserPassword(
      password,
      user?.password,
    );

    if (!isPasswordMatch) {
      return { status: false, message: 'Incorrect email or password' };
    }

    delete user.password;
    return {
      status: true,
      user,
      message: '',
    };
  }

  async login(user: User): Promise<LoginResponse> {
    try {
      console.log({ user });
      if (!user.emailVerified) {
        throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);
      }
      const payload = {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role?.name,
      };

      const data = {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        termsAndCondition: user.termsAndCondition,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        role: user.role,
      };
      const token = await this.generateTokens(payload);
      return {
        status: true,
        message: 'login successful',
        user: data,
        accessToken: token.accessToken,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        accessToken: null,
        user: null,
      };
    }
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const user = await this.userService.findByMail(email);
      if (!user) {
        throw new HttpException('Email does not exist', HttpStatus.BAD_REQUEST);
      }
      const otpRecord = await this.initiateOtp({
        userId: user.id,
        type: OtpType.PIN,
        usage: OtpUsage.RESET_PASSCODE,
      });
      // );
      return {
        status: true,
        message: `OTP had been sent to your mail`,
        otpKey: otpRecord.payload.otpKey,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        otpKey: null,
      };
    }
  }

  async resetPassword(
    resetPasswordDetails: ResetPasswordInput,
  ): Promise<ResetPasswordResponse> {
    try {
      const { otpKey, otp, newPassword } = resetPasswordDetails;

      const otpDecoded = JSON.parse(await decode(otpKey));

      const otpRecord = await this.otpRepository.findOne({
        where: { id: otpDecoded.otp_id },
      });

      if (!otpRecord) {
        throw new HttpException('Invalid Otp', HttpStatus.BAD_REQUEST);
      }

      if (otpRecord.status == OtpStatus.USED) {
        throw new HttpException(
          'Invalid Otp:: already used',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (otpRecord.usage !== OtpUsage.RESET_PASSCODE) {
        throw new HttpException(
          'Invalid Otp:: already used',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (otp.trim() !== otpRecord.otp.trim()) {
        throw new HttpException('Invalid Otp', HttpStatus.BAD_REQUEST);
      }

      const hashedpassword = await this.hashPassword(newPassword);
      await this.userRepository.update(otpRecord.user_id, {
        password: hashedpassword,
      });

      await this.otpRepository.update(otpRecord.id, { status: OtpStatus.USED });
      return {
        status: true,
        message: `Password Successfully Updated`,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
