import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document } from 'mongoose';
import { handleSoftDeleteConcerns, isSoftDelete } from 'src/common/functions';
import { Base } from 'src/database/schema/base.schema';
export type UserDocument = Document & User;

@Schema({ id: true, timestamps: true })
export class User extends Base{
  @Prop({ type: String, unique: true, minlength: 8, maxlength: 12 })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

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