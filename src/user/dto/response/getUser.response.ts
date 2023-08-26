import { Role } from '../../../roles/model/roles.entity';

export class GetUserResponse {
  email: string;

  phone: string;

  firstName: string;

  lastName: string;

  userName: string;

  termsAndCondition: boolean;

  role: Role;

  emailVerified: boolean;

  phoneVerified: boolean;
}
