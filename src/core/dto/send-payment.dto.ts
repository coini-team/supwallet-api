import { IsNotEmpty, IsString } from 'class-validator';

export class SendPaymentDto {
  @IsString({ message: "The 'phone' parameter must be a string." })
  @IsNotEmpty({ message: "The 'phone' parameter is missing" })
  phone: string;

  @IsString({ message: "The 'receiver' parameter must be a string." })
  @IsNotEmpty({ message: "The 'receiver' parameter is missing" })
  receiver: string;

  @IsString({ message: "The 'amount' parameter must be a string." })
  @IsNotEmpty({ message: "The 'amount' parameter is missing" })
  amount: string;

  @IsString({ message: "The 'token' parameter must be a string." })
  @IsNotEmpty({ message: "The 'token' parameter is missing" })
  token: string;

  @IsString({ message: "The 'network' parameter must be a string." })
  @IsNotEmpty({ message: "The 'network' parameter is missing" })
  network: string;
}