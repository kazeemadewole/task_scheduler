import BaseResponse from '../../../base/dto/response/baseResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponse extends BaseResponse {
  @ApiProperty({ name: 'message' })
  message: string;
}
