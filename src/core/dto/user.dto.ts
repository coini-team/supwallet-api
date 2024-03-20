// Third Party Dependencies.
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  network: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
