import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, ObjectId } from 'mongoose';
@Schema({ id: true, timestamps: true })
export abstract class Base {
  _id: ObjectId;
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  pid: string;
  @ApiProperty({ type: Number })
  ord: number;
  @ApiProperty({ type: Date })
  createdAt: Date;
  @ApiProperty({ type: Date })
  updatedAt: Date;
  @ApiProperty({ type: Date })
  deletedAt: Date;
}
