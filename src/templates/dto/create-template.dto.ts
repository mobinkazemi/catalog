import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose, { ObjectId, Schema } from 'mongoose';
import { ObjectIdOrString } from 'src/common/types/types';
import { Part, Template } from '../schema/templates.schema';

export class CreateTemplateDto extends OmitType(Template, [
  'id',
  '_id',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  ord: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  pid: ObjectIdOrString;

  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsString()
  @ApiProperty({ type: String })
  backgroundFileId?: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsString()
  backgroundColor?: string;

  @IsArray()
  @Type(() => Part)
  @ApiProperty({
    type: [Part],
  })
  parts: Part[];
}
