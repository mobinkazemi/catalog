import { OmitType, PickType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { Base } from '../schema/base.schema';

export class BaseSchemaDto {
  @IsOptional()
  @IsNumber()
  ord?: number;
  @IsOptional()
  @IsString()
  @Transform((param) => new mongoose.Types.ObjectId(param.value))
  pid?: string;
  @IsOptional()
  @IsDate()
  @Transform((param) => new Date(param.value))
  createdAt?: Date;
  @IsOptional()
  @IsDate()
  @Transform((param) => new Date(param.value))
  updatedAt?: Date;
  @IsOptional()
  @IsDate()
  @Transform((param) => new Date(param.value))
  deletedAt?: Date;

  constructor(data: Partial<Base>) {
    if (!data) data = {};

    this.ord = data.ord;
    this.pid = data.pid;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}
