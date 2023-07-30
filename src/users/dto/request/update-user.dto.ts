import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserPaswordDto {
  @IsString()
  @IsOptional()
  password?: string;
}

export class UpdateUserRoleDto {
  @IsArray()
  role: Array<string>;
}
