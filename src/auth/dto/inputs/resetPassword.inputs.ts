import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordInput {
  @IsNotEmpty()
  @IsString()
  otpKey: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
}
