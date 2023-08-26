import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TandCDetails {
  @IsNotEmpty()
  @IsBoolean()
  termsAndCondition: boolean;
}
