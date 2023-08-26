import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
