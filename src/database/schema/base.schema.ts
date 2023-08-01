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
  pid: ObjectIdOrString;
  @ApiProperty({ type: Number })
  ord: number;
  @ApiProperty({ type: Date })
  createdAt: Date;
  @ApiProperty({ type: Date })
  updatedAt: Date;
  @ApiProperty({ type: Date })
  deletedAt: Date;
}
