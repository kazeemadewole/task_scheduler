import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { GetAllUserAdminInput, TandCDetails } from './dto/inputs';
import { User, UserStatus } from './models/users.entity';
import {
  GetAllUserResponse,
  GetUserResponse,
  GetUserStatisticsResponse,
  TermsAndConditionResponse,
  VerifyEmailResponse,
} from './dto/response';
import { EmailVerificationDto } from '../auth/dto/inputs';
import moment from 'moment';
import { ROLESENUM } from '../base/base.entity';
import BaseService from 'src/base/base.service';
import { ConfigService } from '@nestjs/config';
import { OtpEntity } from '../otp/models/otp.entity';
import { OtpStatus } from '../utils/enums';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private configService: ConfigService,
  ) {
    super();
  }
  async getUser(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });
  }

  async findbyPhone(phone: string): Promise<any> {
    return this.userRepository.findOne({
      where: { phone },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'phoneVerified',
        'emailVerified',
        'termsAndCondition',
        'created_at',
        'updated_at',
      ],
      relations: {
        role: true,
      },
    });
  }

  async findByMail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'phone',
        'phoneVerified',
        'emailVerified',
        'termsAndCondition',
        'created_at',
        'updated_at',
      ],
      relations: {
        role: true,
      },
    });
  }

  async getAllUsersOrAdmins(
    getAllUserInput: GetAllUserAdminInput,
  ): Promise<GetAllUserResponse> {
    const pagination = {
      page: Number(getAllUserInput.page || 1),
      size: Number(getAllUserInput.size || 10),
    };

    if (!getAllUserInput.role) {
      getAllUserInput.role = ROLESENUM.USER;
    }

    const role = getAllUserInput.role as unknown as ROLESENUM;
    const query = {
      role: {
        name: role,
      },
    };

    if (getAllUserInput.status) {
      query['status'] = getAllUserInput.status;
    }
    const skippedItems = (pagination.page - 1) * pagination.size;
    const [user, totalCount] = await this.userRepository.findAndCount({
      skip: skippedItems,
      take: pagination.size,
      relations: {
        role: true,
      },
      where: query,
      order: {
        created_at: 'DESC',
      },
    });

    return {
      totalCount,
      page: pagination.page,
      size: pagination.size,
      data: user as unknown as GetUserResponse[],
    };
  }

  async verify_email(
    email_verification_details: EmailVerificationDto,
  ): Promise<VerifyEmailResponse> {
    try {
      const user = await this.findByMail(email_verification_details.email);
      if (!user) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }

      if (user.emailVerified) {
        throw new HttpException(
          'Email had already been verified',
          HttpStatus.BAD_REQUEST,
        );
      }

      const OtpRecord = await this.otpRepository.findOne({
        where: { user_id: user.id, status: OtpStatus.UNUSED },
        order: { created_at: 'desc' },
      });

      if (!OtpRecord) {
        throw new HttpException(
          'Please initiate an Otp first',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (OtpRecord.status == OtpStatus.USED) {
        throw new HttpException(
          'Otp had already been used',
          HttpStatus.BAD_REQUEST,
        );
      }

      const now = new Date();
      if (now.getSeconds() > parseInt(OtpRecord.expirationTime)) {
        throw new HttpException(
          'Expired Otp, Please initiate a new one',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (OtpRecord.otp.trim() !== email_verification_details.code) {
        throw new HttpException(
          'Invalid verification Code',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.emailVerified = true;
      await this.userRepository.save(user);

      await this.otpRepository.update(OtpRecord.id, {
        status: OtpStatus.USED,
      });
      return {
        status: true,
        message: 'Email successfully verified',
        user,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        user: null,
      };
    }
  }

  async acceptTermsAndcondition(
    currentUserId: string,
    tandCDetails: TandCDetails,
  ): Promise<TermsAndConditionResponse> {
    try {
      if (!tandCDetails.termsAndCondition) {
        throw new HttpException(
          'Please Accept terms and Condition',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.getUser(currentUserId);

      if (!user) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }

      user.termsAndCondition = tandCDetails.termsAndCondition;
      await this.userRepository.save(user);
      return {
        status: true,
        message: 'Terms and Condition Successfully accepted',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async getUserStatistics(): Promise<GetUserStatisticsResponse> {
    try {
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD hh:mm');
      const todaysStartDate = moment()
        .startOf('day')
        .format('YYYY-MM-DD hh:mm');
      const todaysEndDate = moment().endOf('day').format('YYYY-MM-DD hh:mm');
      const [
        total_User,
        totalMonthlySignup,
        totaldailySignup,
        totalActiveUsers,
        totalInactiveUsers,
      ] = await Promise.all([
        this.userRepository.count({
          relations: {
            role: true,
          },
          where: {
            role: {
              name: ROLESENUM.USER,
            },
          },
        }),
        this.userRepository.count({
          relations: {
            role: true,
          },
          where: {
            created_at: Between(startOfMonth, endOfMonth),
            role: {
              name: ROLESENUM.USER,
            },
          },
        }),
        this.userRepository.count({
          relations: {
            role: true,
          },
          where: {
            created_at: Between(todaysStartDate, todaysEndDate),
            role: {
              name: ROLESENUM.USER,
            },
          },
        }),
        this.userRepository.count({
          relations: {
            role: true,
          },
          where: {
            status: UserStatus.ACTIVE,
            role: {
              name: ROLESENUM.USER,
            },
          },
        }),
        this.userRepository.count({
          relations: {
            role: true,
          },
          where: {
            status: UserStatus.IN_ACTIVE,
            role: {
              name: ROLESENUM.USER,
            },
          },
        }),
      ]);

      return {
        totalUsers: total_User,
        totalMonthlySignup: totalMonthlySignup,
        totalDailySignup: totaldailySignup,
        totalActiveUsers,
        totalInactiveUsers,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
