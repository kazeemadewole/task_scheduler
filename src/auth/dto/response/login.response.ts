import { GetUserBaseResponse } from '../../../base/dto/response/baseUserResponse.dto';
import BaseResponse from '../../../base/dto/response/baseResponse.dto';

export class LoginResponse extends BaseResponse {
  user: GetUserBaseResponse;

  message: string;

  accessToken: string;
}
