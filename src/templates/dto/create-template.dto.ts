import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import mongoose, { ObjectId, Schema } from 'mongoose';
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
  @Transform((param) => new mongoose.Types.ObjectId(param.value))
  pid: string;

  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsString()
  @ApiProperty({ type: String })
  backgroundFileId?: string;

  @IsString()
  @ApiProperty({ type: String })
  backgroundColor?: string;

  @IsObject()
  @ApiProperty({
    type: [Part],
  })
  parts: Part[];

  constructor(data: any) {
    super();
    this.backgroundColor = data.backgroundColor;
    this.backgroundFileId = data.backgroundFileId;
    this.name = data.name;
    this.ord = data.ord;
    this.parts = data.parts;
    this.pid = data.pid;
  }
}

export const CreateTemplateDtoExample: CreateTemplateDto = {
  name: 'sample',
  ord: 1,
  parts: [],
  pid: new mongoose.Types.ObjectId().toString(),
  backgroundColor: 'blue',
  backgroundFileId: new mongoose.Types.ObjectId().toString(),
};
