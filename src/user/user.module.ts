import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { OtpEntity } from 'src/otp/models/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OtpEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
