import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/users/schema/users.schema';

export class UpdateUserDto extends PartialType(OmitType(User, ['_id', 'id'])) {
  @IsOptional()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;
  @IsOptional()
  @MinLength(4)
  @MaxLength(12)
  @IsAlphanumeric()
  @IsString()
  username?: string;
  @IsOptional()
  @IsArray()
  roles?: Array<string>;

  constructor(data?: Partial<User>) {
    super();
    if (!data) data = {};

    this.password = data.password;
    this.username = data.username;
    this.roles = data.roles;
  }
}
