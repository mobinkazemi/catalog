import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  Document } from 'mongoose';
import { handleSoftDeleteConcerns, isSoftDelete } from 'src/common/functions/soft-delete.function';
import { Base } from 'src/database/schema/base.schema';

export type RoleDocument = Document & Role;

@Schema({ id: true, timestamps: true })
export class Role extends Base{
  @Prop({ type: String, unique: true,required:true, minlength: 2, maxlength: 64 })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('updateOne', function(next){
    let updateData = this.getUpdate()
    if(isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);    
    return next()
})
RoleSchema.pre('updateMany', function(next){
    let updateData = this.getUpdate()    
    if(isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);   
    next();
});
RoleSchema.pre('findOneAndUpdate', function(next) {
    let updateData = this.getUpdate()    
    if(isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);   
    next();
})