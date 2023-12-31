import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ObjectIdOrString, ObjectIdType } from 'src/common/types/types';
import { Base } from '../../database/schema/base.schema';
import { UI_Defaults, UI_Types_Enum } from '../defaults/ui.defaults';
import { addTemplateHooks } from '../hook/templates.hooks';

export type TemplateDocument = Document & Template;

export class Specification {
  @ApiProperty({ type: Number })
  @Prop({
    type: Number,
  })
  ord?: number;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  tag?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    required: true,
  })
  key: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    required: true,
  })
  value: string;
}
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

  @ApiProperty({ type: Array<String> })
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    autoPopulate: true,
    required: true,
  })
  fileIds: Array<ObjectIdOrString>;

  @ApiProperty({ type: Array<String> })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    autoPopulate: true,
  })
  categoryIds?: Array<ObjectIdOrString>;

  @ApiProperty({ type: [Specification] })
  @Prop({
    type: Array<Specification>,
  })
  specifications?: Array<Specification>;
}

export class About {
  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  title?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  description?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  })
  logoFileId?: ObjectIdOrString;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  address?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  location?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  phone?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  cellphone?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  email?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  telegram?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  instagram?: string;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
  })
  twitter?: string;
}

export class UI {
  @ApiProperty({ type: String })
  @Prop({
    type: String,
    default: UI_Defaults.buttonOfVitrine,
  })
  buttonOfVitrine?: String;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    default: UI_Defaults.buttonOfAbout,
  })
  buttonOfAbout?: String;

  @ApiProperty({ type: String })
  @Prop({
    type: String,
    default: UI_Defaults.textOfPartDesc,
  })
  textOfPartDesc?: String;

  @ApiProperty({ type: String, enum: UI_Types_Enum })
  @Prop({
    type: String,
    enum: UI_Types_Enum,
    default: UI_Types_Enum.FURNITURE,
  })
  type?: String;
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

  @ApiProperty({ type: About })
  @Prop({
    type: About,
  })
  about?: About;

  @ApiProperty({ type: UI })
  @Prop({
    type: UI,
    required: true,
    default: UI_Defaults,
  })
  ui?: UI;

  @ApiProperty({ type: String })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  ownerId?: ObjectIdOrString;
}

const TemplateSchemaBase = SchemaFactory.createForClass(Template);
// TemplateSchemaBase.plugin(require('mongoose-autopopulate'));
export const TemplateSchema = addTemplateHooks(TemplateSchemaBase);
