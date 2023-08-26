import BaseResponse from '../../../base/dto/response/baseResponse.dto';
import { User } from '../../models/users.entity';

export class VerifyEmailResponse extends BaseResponse {
  message: string;

  user: User;
}
