import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from '../../database/schema/base.schema';

export type LogDocument = Document & Log;

@Schema({ id: true, timestamps: true })
export class Log extends Base {
  @Prop({
    type: String,
  })
  method: string;

  @Prop({
    type: String,
  })
  url: string;

  @Prop({
    type: Number,
  })
  statusCode: number;

  @Prop({
    type: Object,
  })
  payload: Object;

  @Prop({
    type: String,
  })
  message: string;

  @Prop({
    type: Object,
  })
  requestData: object;

  @Prop({
    type: Object,
  })
  responseData: object;
}

export const LogSchema = SchemaFactory.createForClass(Log);
