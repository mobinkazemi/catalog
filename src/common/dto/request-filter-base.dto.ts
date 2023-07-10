import mongoose from 'mongoose';

export class FilterBaseRequestDto {
  id?: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data: any) {
    data.id ? (this._id = new mongoose.Types.ObjectId(data?.id)) : null;

    data.createdAt ? (this.createdAt = data.createdAt) : null;
    data.updatedAt ? (this.updatedAt = data.updatedAt) : null;
    data.deletedAt ? (this.deletedAt = data.deletedAt) : null;
  }
}
