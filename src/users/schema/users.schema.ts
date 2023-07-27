import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '../../database/schema/base.schema';
import { addUserHooks } from '../hook/users.hook';

export type UserDocument = Document & User;

@Schema({ id: true, timestamps: true })
export class User extends Base {
  @Prop({ type: String, unique: true, minlength: 8, maxlength: 12 })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Array<string>, default: [], required: false })
  roles: Array<string>;
}

let UserSchemaBase = SchemaFactory.createForClass(User);
export const UserSchema = addUserHooks(UserSchemaBase);
