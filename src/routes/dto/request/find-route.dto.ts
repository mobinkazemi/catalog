import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class RouteListRequestDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @Transform((item) => {
    item.value = item.value.toLowerCase();
    return item.value;
  })
  @IsOptional()
  path?: string;

  @ApiProperty({
    type: String,
  })
  @IsEnum(METHODS)
  @IsOptional()
  method?: string;

  @ApiProperty({
    type: Array<String>,
  })
  @Transform((item) => {
    item.value = item.value.map((el: string) => el.toUpperCase());
    return item.value;
  })
  @IsArray()
  @IsOptional()
  roles?: Array<string>;

  @ApiProperty({
    type: Boolean,
  })
  @Transform((item) => {
    item.value = Boolean(item.value.toLowerCase());
    return item.value;
  })
  @IsBooleanString()
  @IsOptional()
  isPublic?: boolean;
}
