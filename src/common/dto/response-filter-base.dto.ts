import mongoose from 'mongoose';

export class BaseResponseFilterDto {
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data: any) {
    this._id = data?._id;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    data.deletedAt ? (this.deletedAt = data.deletedAt) : null;
  }
}
