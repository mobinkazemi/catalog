import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { addGeneralHooks } from 'src/common/hook/roles.hook';
import { Base } from '../../database/schema/base.schema';

export type RouteDocument = Document & Route;

@Schema({ id: true, timestamps: true })
export class Route extends Base {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
  })
  path: string;

  @Prop({
    type: String,
    required: true,
    uppercase: true,
  })
  method: string;

  @Prop({
    type: Array<String>,
    uppercase: true,
    default: [],
  })
  roles?: Array<string>;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPublic?: boolean;
}

const RouteSchemaBase = SchemaFactory.createForClass(Route);
export const RouteSchema = addGeneralHooks(RouteSchemaBase);
