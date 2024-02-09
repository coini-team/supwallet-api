// Third Party Dependencies.
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
