import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { FilterBaseRequestDto } from '../../../common/dto/request-filter-base.dto';
import { BaseResponseFilterDto } from '../../../common/dto/response-filter-base.dto';

export class FilterRequestUserDto extends FilterBaseRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ type: Array<String> })
  @IsOptional()
  @IsArray({ each: true })
  @Type(() => String)
  roles?: Array<string>;

  constructor(data) {
    if (!data) data = {};
    super(data);
    data.username ? (this.username = data.username) : null;
    data.roles ? (this.roles = data.roles) : null;
  }
}

export class UserResponseListDto extends BaseResponseFilterDto {
  username?: string;
  roles?: Array<string>;

  constructor(data) {
    if (!data) data = {};
    super(data);
    this.username = data.username;
    this.roles = data.roles;
  }
}
