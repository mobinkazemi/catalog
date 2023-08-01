import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, ObjectId } from 'mongoose';
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
    type: mongoose.Types.ObjectId,
    ref: 'File',
    autoPopulate: { maxlength: 1 },
    required: true,
  })
  fileId: ObjectId;
}

@Schema({ id: true, timestamps: true })
export class Template extends Base {
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
    type: mongoose.Types.ObjectId,
    ref: 'File',
    autoPopulate: { maxlength: 1 },
  })
  backgroundFileId?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  backgroundColor?: string;

  @ApiProperty({ type: [Part] })
  @Prop({
    type: Array<Part>,
  })
  parts: Array<Part>;
}

const TemplateSchemaBase = SchemaFactory.createForClass(Template);
export const TemplateSchema = addTemplateHooks(TemplateSchemaBase);
