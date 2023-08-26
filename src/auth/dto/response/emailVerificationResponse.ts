import { GetUserBaseResponse } from '../../../base/dto/response/baseUserResponse.dto';
import BaseResponse from '../../../base/dto/response/baseResponse.dto';
import { Role } from '../../../roles/model/roles.entity';

export class EmailVerificationResponse extends BaseResponse {
  user: GetUserBaseResponse;

  role: Role;

  message: string;

  accessToken: string;
}