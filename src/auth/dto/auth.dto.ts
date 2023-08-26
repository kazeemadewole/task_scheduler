export class payloadDto {
  user: payloadUserDto;
  iat: number;
  exp: number;
  iss: string;
}

export class tokenDto {
  accessToken: string;
}

export class payloadUserDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
}
