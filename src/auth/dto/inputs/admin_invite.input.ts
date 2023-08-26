import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminInviteDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
