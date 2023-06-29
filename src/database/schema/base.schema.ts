import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BaseDocument = Document & Base;

@Schema({ id: true, timestamps: true })
export class Base {
  @Prop({type:mongoose.Types.ObjectId, required: true})
  _id:string;
  @Prop({type:Date, required:true})
  createdAt:Date;
  @Prop({type:Date, required:true})
  updatedAt:Date
  @Prop({ type: Date, required: false })
  deletedAt: Date;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
