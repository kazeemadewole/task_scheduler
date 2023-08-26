import { GetUserResponse } from './getUser.response';

export class GetAllUserResponse {
  totalCount: number;

  page: number;

  size: number;

  data: GetUserResponse[];
}
