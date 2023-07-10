import mongoose from 'mongoose';

export class BaseResponseFilterDto {
  id?: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data: any) {
    this.id = data.id || (data._id ? data?._id?.toString() : null);
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    data.deletedAt ? (this.deletedAt = data.deletedAt) : null;
  }
}
