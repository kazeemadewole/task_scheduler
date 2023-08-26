import BaseResponse from '../../../base/dto/response/baseResponse.dto';

export class SignUpResponse extends BaseResponse {
  message: string;

  otpKey: string;
}
