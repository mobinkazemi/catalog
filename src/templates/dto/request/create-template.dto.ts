import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import mongoose, { ObjectId, Schema } from 'mongoose';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString } from 'src/common/types/types';
import { Part, Template } from '../../schema/templates.schema';

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

  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  fileId: ObjectIdOrString;

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

  constructor(data: Partial<Part>) {
    super();
    if (!data) data = {};
    this.title = data.title;
    this.text = data.text;
    this.fileId = data.fileId;
    this.position = data.position;
    this.ord = data.ord;
    this.pid = data.pid;
    this.link = data.link;
  }
}
