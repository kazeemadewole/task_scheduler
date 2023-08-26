import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/base/dto/input';

export class GetAllUserAdminInput extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
