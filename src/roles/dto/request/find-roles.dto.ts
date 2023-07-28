import { IsOptional, IsString } from 'class-validator';

export class FindRolesListDto {
  @IsString()
  @IsOptional()
  name?: string;
}
