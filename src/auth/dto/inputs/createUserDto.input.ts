import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'firstName' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'lastName' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ name: 'phone', example: '+234********' })
  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 11)
  phone: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  password: string;
}
