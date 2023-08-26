import { GetUserBaseResponse } from '../../../base/dto/response/baseUserResponse.dto';
import BaseResponse from '../../../base/dto/response/baseResponse.dto';

export class AdminSignUpResponse extends BaseResponse {
  message: string;

  user: GetUserBaseResponse;
}
