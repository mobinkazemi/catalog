import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
@Schema({ id: true, timestamps: true })
export abstract class Base {
  _id: ObjectId;
  id: string;
  pid: ObjectId;
  ord: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
