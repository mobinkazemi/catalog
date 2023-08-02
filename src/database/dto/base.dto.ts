import { OmitType, PickType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { ObjectIdOrString } from 'src/common/types/types';
import { Base } from '../schema/base.schema';

export class BaseSchemaDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  ord?: number;
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Transform((param) => new mongoose.Types.ObjectId(param.value))
  pid?: ObjectIdOrString;
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Transform((param) => new Date(param.value))
  createdAt?: Date;
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Transform((param) => new Date(param.value))
  updatedAt?: Date;
  @ApiProperty({ type: Date })
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
