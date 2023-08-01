import mongoose from 'mongoose';

export type ObjectIdType = mongoose.Types.ObjectId;
export type ObjectIdOrString = ObjectIdType | String;
