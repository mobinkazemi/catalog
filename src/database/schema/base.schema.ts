import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BaseDocument = Document & Base;

@Schema({ id: true, timestamps: true })
export class Base {
  @Prop({ type: Date, required: false })
  deletedAt: Date;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
