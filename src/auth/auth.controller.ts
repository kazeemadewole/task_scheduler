import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../user/models/users.entity';
import { AuthService } from './auth.service';
import {
  AdminCreateUserDto,
  CreateUserDto,
  EmailVerificationDto,
  LoginUserInput,
  ResetPasswordInput,
} from './dto/inputs';
import {
  AdminSignUpResponse,
  EmailVerificationResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  SignUpResponse,
} from './dto/response';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  create(@Body() createUserDetails: CreateUserDto): Promise<SignUpResponse> {
    try {
      return this.authService.createUser(createUserDetails);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('create/admin')
  admin_signup(
    @Body() createUserDetails: AdminCreateUserDto,
  ): Promise<AdminSignUpResponse> {
    try {
      return this.authService.createAdminUser(createUserDetails);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  login(
    @Body() loginUserInput: LoginUserInput,
    @AuthUser() user: User,
  ): Promise<object> {
    try {
      return this.authService.login(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('forgot-password')
  forgotPassword(
    @Body('email')
    email: string,
  ): Promise<ForgotPasswordResponse> {
    try {
      return this.authService.forgotPassword(email);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('reset-password')
  resetPassword(
    @Body()
    resetPasswordInput: ResetPasswordInput,
  ): Promise<ResetPasswordResponse> {
    try {
      return this.authService.resetPassword(resetPasswordInput);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('verify-email')
  verifyEmail(
    @Body()
    email_verification_details: EmailVerificationDto,
  ): Promise<EmailVerificationResponse> {
    try {
      return this.authService.verify_email(email_verification_details);
    } catch (error) {
      throw new Error(error);
    }
  }
}
