import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MinDate,
  validateSync,
} from 'class-validator';
import mongoose, { isObjectIdOrHexString, ObjectId, Schema } from 'mongoose';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString, ObjectIdType } from 'src/common/types/types';
import { About, Part, Template, UI } from '../../schema/templates.schema';

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
  @Matches(ObjectIdRegex)
  pid: ObjectIdOrString;

  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  backgroundFileId?: ObjectIdOrString;

  @IsOptional()
  @ApiProperty({ type: String })
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Part)
  @ApiProperty({
    type: [Part],
  })
  parts?: Part[];

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDateString()
  expiredAt?: Date;

  @IsOptional()
  @ApiProperty({ type: About })
  about?: About;

  @IsOptional()
  @ApiProperty({ type: UI })
  ui?: UI;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  ownerId?: ObjectIdOrString;
}

export class CreatePartOfTemplateDto extends OmitType(Part, [
  '_id',
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  templateId: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ type: Array<String> })
  @Matches(ObjectIdRegex, { each: true })
  @IsArray()
  fileIds: Array<ObjectIdOrString>;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  position: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  ord: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @Matches(ObjectIdRegex)
  @IsString()
  pid: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  link: string;

  @ApiProperty({ type: Array<String> })
  @IsOptional()
  @IsArray()
  @Matches(ObjectIdRegex, { each: true })
  categoryIds?: Array<ObjectIdOrString>;
}
