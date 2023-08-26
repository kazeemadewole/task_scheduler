import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/models/users.entity';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserResetPassword } from '../user/models/userResetPassword.entity';
import { RolesModule } from '../roles/roles.module';
import { UserEmailVerification } from '../user/models/useremailverification.entity';
import { AuthController } from './auth.controller';
import { InvitationToken } from '../user/models/invitationToken.entity';
import { OtpEntity } from '../otp/models/otp.entity';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User,
      UserResetPassword,
      UserEmailVerification,
      InvitationToken,
      OtpEntity,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => RolesModule),
    PassportModule,
  ],
  providers: [AuthService, AtStrategy, RtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
