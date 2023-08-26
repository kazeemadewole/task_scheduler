import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
