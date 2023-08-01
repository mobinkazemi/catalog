import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Base } from '../../database/schema/base.schema';
import { addTemplateHooks } from '../hook/templates.hooks';

export type TemplateDocument = Document & Template;

@Schema({ id: true, timestamps: true })
class Part extends Base {
  @Prop({
    type: String,
  })
  title?: string;

  @Prop({
    type: String,
  })
  text?: string;

  @Prop({
    type: String,
  })
  position?: string;

  @Prop({
    type: String,
    trim: true,
  })
  link?: string;

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
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 128,
    lowercase: true,
    trim: true,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'File',
    autoPopulate: { maxlength: 1 },
  })
  backgroundFileId?: ObjectId;

  @Prop({
    type: String,
  })
  backgroundColor?: string;

  @Prop({
    type: [Part],
  })
  parts: Part[];
}

const TemplateSchemaBase = SchemaFactory.createForClass(Template);
export const TemplateSchema = addTemplateHooks(TemplateSchemaBase);
