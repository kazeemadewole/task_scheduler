import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './models/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
})
export class OtpModule {}
