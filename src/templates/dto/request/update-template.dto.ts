import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString } from 'src/common/types/types';
import { Part, Template } from 'src/templates/schema/templates.schema';
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
}

export class UpdatePartOfTemplateDto extends PartialType(
  OmitType(Part, ['_id', 'id', 'createdAt', 'deletedAt', 'updatedAt']),
) {
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
  @IsOptional()
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
}
