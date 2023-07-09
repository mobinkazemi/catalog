import * as bcrypt from 'bcryptjs';
import {
  handleSoftDeleteConcerns,
  isSoftDelete,
} from 'src/common/functions/soft-delete.function';
import mongoose from 'mongoose';

export function addUserHooks(schema: mongoose.Schema): mongoose.Schema {
  schema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }

    next();
  });

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
