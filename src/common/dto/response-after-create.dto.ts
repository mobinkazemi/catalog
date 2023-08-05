import { ObjectIdType } from '../types/types';

export class ResponseAfterCreateDto {
  _id?: ObjectIdType;

  constructor(data: any) {
    this._id = data?._id;
  }
}
