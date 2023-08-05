import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ObjectIdOrString, ObjectIdType } from 'src/common/types/types';
import { Base } from '../../database/schema/base.schema';
import { addTemplateHooks } from '../hook/templates.hooks';

export type TemplateDocument = Document & Template;

@Schema({ id: true, timestamps: true })
export class Part extends Base {
  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  title?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  text?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  position?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    trim: true,
  })
  link?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    autoPopulate: true,
    required: true,
  })
  fileId: ObjectIdOrString;

  @ApiProperty({ type: Array<String> })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    autoPopulate: true,
  })
  categoryIds?: Array<ObjectIdOrString>;
}

@Schema({ id: true, timestamps: true })
export class Template extends Base {
  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Template' })
  pid: ObjectIdOrString;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 128,
    lowercase: true,
    trim: true,
    required: true,
  })
  name: string;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    autoPopulate: true,
  })
  backgroundFileId?: ObjectIdOrString;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  backgroundColor?: string;

  @ApiProperty({ type: [Part] })
  @Prop({
    type: Array<Part>,
  })
  parts?: Array<Part>;

  @ApiProperty({ type: Date })
  @Prop({
    type: Date,
  })
  expiredAt?: Date;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    autoPopulate: true,
  })
  categoryId?: ObjectIdOrString;
}

const TemplateSchemaBase = SchemaFactory.createForClass(Template);
// TemplateSchemaBase.plugin(require('mongoose-autopopulate'));
export const TemplateSchema = addTemplateHooks(TemplateSchemaBase);
