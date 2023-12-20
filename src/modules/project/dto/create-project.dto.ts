// Third Party Dependencies.
import { IsInt, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsInt()
  organization_id: number;

  @IsString()
  @Length(1, 500)
  name: string;

  @IsString()
  mode: string;

  @IsInt()
  project_id: number;

  @IsString()
  status: string;
}
