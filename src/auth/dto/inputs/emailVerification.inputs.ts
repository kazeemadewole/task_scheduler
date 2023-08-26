import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class EmailVerificationDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
