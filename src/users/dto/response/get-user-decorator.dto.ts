import mongoose from 'mongoose';
export class getPayloadDecoratorDto {
  _id: mongoose.Types.ObjectId;
  id: string;
  roles: Array<string>;

  constructor(data: any) {
    this._id = new mongoose.Types.ObjectId(data.userId);
    this.id = data.userId;
    this.roles = data.roles;
  }
}
