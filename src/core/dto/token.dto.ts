// Third Party Dependencies.
import { IsNotEmpty, IsString } from 'class-validator';

export class TokensDto {
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}