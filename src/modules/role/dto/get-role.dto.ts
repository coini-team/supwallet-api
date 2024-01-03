// Third Party Dependencies.
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// Local Dependencies.
import { User } from '../../user/entities/user.entity';

export class GetRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  users: User[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
