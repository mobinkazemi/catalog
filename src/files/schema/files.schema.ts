import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { handleSoftDeleteConcerns, isSoftDelete } from 'src/common/functions';
import { Base } from 'src/database/schema/base.schema';

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

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.pre('updateOne', function (next) {
  let updateData = this.getUpdate();
  if (isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);
  return next();
});
FileSchema.pre('updateMany', function (next) {
  let updateData = this.getUpdate();
  if (isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);
  next();
});
FileSchema.pre('findOneAndUpdate', function (next) {
  let updateData = this.getUpdate();
  if (isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);
  next();
});
