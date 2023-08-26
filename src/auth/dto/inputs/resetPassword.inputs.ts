import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordInput {
  @ApiProperty({ name: 'otpKey' })
  @IsNotEmpty()
  @IsString()
  otpKey: string;

  @ApiProperty({ name: 'otp' })
  @IsNotEmpty()
  @IsNumberString()
  otp: string;

  @ApiProperty({ name: 'newPassword' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
}
