import mongoose from 'mongoose';
import {
  handleSoftDeleteConcerns,
  isSoftDelete,
} from '../../common/functions/soft-delete.function';

export function addRoleHooks(schema: mongoose.Schema): mongoose.Schema {
  schema.pre('updateOne', function (next) {
    let updateData = this.getUpdate();
    if (isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);
    return next();
  });
  schema.pre('updateMany', function (next) {
    let updateData = this.getUpdate();
    if (isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);
    next();
  });
  schema.pre('findOneAndUpdate', function (next) {
    let updateData = this.getUpdate();
    if (isSoftDelete(updateData)) handleSoftDeleteConcerns(updateData);
    next();
  });

  return schema;
}
