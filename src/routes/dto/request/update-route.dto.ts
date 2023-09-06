import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString } from 'src/common/types/types';

export class UpdateRouteDto {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  id: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isPublic?: boolean;
}
