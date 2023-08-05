import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { addGeneralHooks } from 'src/common/hook/roles.hook';
import {
  handleSoftDeleteConcerns,
  isSoftDelete,
} from '../../common/functions/soft-delete.function';
import { Base } from '../../database/schema/base.schema';

export type CategoryDocument = Document & Category;

@Schema({ id: true, timestamps: true })
export class Category extends Base {
  @Prop({
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  name: string;
}

const CategorySchemaBase = SchemaFactory.createForClass(Category);
export const CategorySchema = addGeneralHooks(CategorySchemaBase);
