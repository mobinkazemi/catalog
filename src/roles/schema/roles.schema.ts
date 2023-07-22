import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  handleSoftDeleteConcerns,
  isSoftDelete,
} from '../../common/functions/soft-delete.function';
import { Base } from '../../database/schema/base.schema';
import { addRoleHooks } from '../hook/roles.hook';

export type RoleDocument = Document & Role;

@Schema({ id: true, timestamps: true })
export class Role extends Base {
  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 64,
  })
  name: string;
}

const RoleSchemaBase = SchemaFactory.createForClass(Role);
export const RoleSchema = addRoleHooks(RoleSchemaBase);
