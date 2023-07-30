import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password?: string;
}

export class UpdateUserRoleDto {
  @IsArray()
  role: Array<string>;
}
