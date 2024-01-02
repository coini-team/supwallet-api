import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateNftDto {
    //@IsString({ message: "type must be a string" })
    //@IsNotEmpty ({message: "falta el parametro 'type', que debe ser un string " })
    type: string;

    @IsString({ message: "name must be a string" })
    @IsNotEmpty ({message: "falta el parametro 'name', que debe ser un string " })
    name: string;

    @IsString({ message: "symbol must be a string" })
    @IsNotEmpty ({message: "falta el parametro 'symbol'. que debe ser un string " })
    symbol: string;

    //@IsNumber()
    supply: number;
}