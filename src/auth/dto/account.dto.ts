// Third Party Dependencies.
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
