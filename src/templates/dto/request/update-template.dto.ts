import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinDate,
} from 'class-validator';
import mongoose from 'mongoose';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString, ObjectIdType } from 'src/common/types/types';
import {
  About,
  Part,
  Specification,
  Template,
  UI,
} from 'src/templates/schema/templates.schema';
import { CreateTemplateDto } from './create-template.dto';

export class UpdateTemplateDto extends PartialType(
  OmitType(Template, [
    '_id',
    'id',
    'createdAt',
    'deletedAt',
    'updatedAt',
    'parts',
  ]),
) {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  templateId: ObjectIdOrString;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  ord: number;

  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsOptional()
  @IsString()
  pid: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Matches(ObjectIdRegex)
  @IsString()
  backgroundFileId?: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
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

export class UpdateTemplateDtoByCustomer extends OmitType(UpdateTemplateDto, [
  'ownerId',
  'expiredAt',
]) {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  templateId: ObjectIdOrString;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  ord: number;

  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsOptional()
  @IsString()
  pid: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Matches(ObjectIdRegex)
  @IsString()
  backgroundFileId?: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @ApiProperty({ type: About })
  about?: About;

  @IsOptional()
  @ApiProperty({ type: UI })
  ui?: UI;
}

export class UpdatePartOfTemplateDto extends PartialType(
  OmitType(Part, ['_id', 'id', 'createdAt', 'deletedAt', 'updatedAt']),
) {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  templateId: ObjectIdOrString;

  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  partId: ObjectIdOrString;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ type: Array<String> })
  @IsOptional()
  @IsArray()
  @Matches(ObjectIdRegex, { each: true })
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

  @ApiProperty({ type: Array<Specification> })
  @IsOptional()
  @IsArray()
  specifications?: Specification[];
}
