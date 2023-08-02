import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ObjectIdOrString, ObjectIdType } from 'src/common/types/types';
@Schema({ id: true, timestamps: true })
export abstract class Base {
  _id: ObjectIdType;
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pid: ObjectIdOrString;
  @ApiProperty({ type: Number })
  @Prop({ type: Number })
  ord: number;
  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  createdAt: Date;
  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  updatedAt: Date;
  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  deletedAt: Date;
}
