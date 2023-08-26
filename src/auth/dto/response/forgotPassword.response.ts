import BaseResponse from '../../../base/dto/response/baseResponse.dto';

export class ForgotPasswordResponse extends BaseResponse {
  message: string;

  otpKey: string;
}
