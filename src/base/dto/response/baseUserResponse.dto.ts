import { Role } from 'src/roles/model/roles.entity';

export class GetUserBaseResponse {
  email: string;

  phone: string;

  firstName: string;

  lastName: string;

  termsAndCondition: boolean;

  role: Role;

  emailVerified: boolean;

  phoneVerified: boolean;
}
