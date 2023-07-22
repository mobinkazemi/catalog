import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Base } from '../../database/schema/base.schema';
import { addFileHooks } from '../hook/files.hooks';

export type FileDocument = Document & File;

@Schema({ id: true, timestamps: true })
export class File extends Base {
  @Prop({ type: String, maxlength: 128 })
  name: string;

  @Prop({ type: String, maxlength: 128 })
  mime: string;

  @Prop({ type: Number })
  size: number;
}

const FileSchemaBase = SchemaFactory.createForClass(File);
export const FileSchema = addFileHooks(FileSchemaBase);
