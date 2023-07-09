import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  Document } from 'mongoose';
import { handleSoftDeleteConcerns, isSoftDelete } from 'src/common/functions/soft-delete.function';
import { Base } from 'src/database/schema/base.schema';
import * as bcrypt from 'bcryptjs'
import { RolesEnum } from 'src/common/enums/roles.enum';

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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  
  next();
});
UserSchema.pre('updateOne', function(next){
    let updateData = this.getUpdate()
    if(isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);    
    return next()
})
UserSchema.pre('updateMany', function(next){
    let updateData = this.getUpdate()    
    if(isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);   
    next();
});
UserSchema.pre('findOneAndUpdate', function(next) {
    let updateData = this.getUpdate()    
    if(isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);   
    next();
})