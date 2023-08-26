import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * A DTO representing data to be sent when setting transaction pin.
 */
export class SetTransactionPinDTO {
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  readonly pin: string;
}
