import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  Document } from 'mongoose';
import { Base } from 'src/database/schema/base.schema';
import * as bcrypt from 'bcryptjs'
import { RolesEnum } from 'src/common/enums/roles.enum';
import { addUserHooks } from '../hook/users.hook';

export type UserDocument = Document & User;

@Schema({ id: true, timestamps: true })
export class User extends Base{
  @Prop({ type: String, unique: true, minlength: 8, maxlength: 12 })
  username: string;

  @Prop({ type: String, required:true })
  password: string;

  @Prop({type: Array<RolesEnum>, default: [], required: false})
  roles: Array<RolesEnum>;
}

let UserSchemaBase = SchemaFactory.createForClass(User);
export const UserSchema = addUserHooks(UserSchemaBase);
