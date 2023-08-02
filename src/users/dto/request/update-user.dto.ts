import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, classToPlain } from 'class-transformer';
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
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { User } from 'src/users/schema/users.schema';

export class UpdateUserDto extends PartialType(OmitType(User, ['_id', 'id'])) {
  @ApiProperty({ type: String })
  @IsOptional()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;
  @ApiProperty({ type: String })
  @IsOptional()
  @MinLength(4)
  @MaxLength(12)
  @IsAlphanumeric()
  @IsString()
  username?: string;
  @ApiProperty({ type: Array<String> })
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

export class UpdateNotAdminUserDto extends PickType(UpdateUserDto, [
  'password',
]) {
  constructor() {
    super();
  }
}

export class UpdateUserByAdminDto extends BaseSchemaDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;
  @ApiProperty({ type: String })
  @IsOptional()
  @MinLength(4)
  @MaxLength(12)
  @IsAlphanumeric()
  @IsString()
  username?: string;
}
