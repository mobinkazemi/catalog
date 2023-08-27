import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ObjectIdRegex } from '../constants/objectId-regex.constant';

export class findByIdDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  id: string;
}

export class RepositoryOptionsDto {
  show: 'all' | 'removed';
}

export class addSortDto {
  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsBoolean()
  @Transform((param) => {
    if ([true, 'true', 1, '1'].includes(param.value)) return true;
    else return false;
  })
  asc?: boolean;
}

export class addLimitDto {
  @IsOptional()
  @Max(100, { message: 'حداکثر تعداد نمایش ۱۰۰ می باشد' })
  @Min(1, { message: 'حداقل تعداد نمایش ۱ می باشد' })
  @IsNumber({}, { message: 'تعداد باید عدد ارسال شود' })
  @Transform((param) => {
    const value = +param.value;
    if (Number.isNaN(value)) return '';
    return value;
  })
  limit: number;
}

export class addPaginationDto {
  @IsOptional()
  @Min(1, { message: 'حداقل تعداد نمایش ۱ می باشد' })
  @IsNumber({}, { message: 'تعداد باید عدد ارسال شود' })
  @Transform((param) => {
    const value = +param.value;
    if (Number.isNaN(value)) return '';
    return value;
  })
  page: number;
}

export class addListOptionsDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Transform((param) => {
    if ([true, 'true', 1, '1'].includes(param.value)) return true;
    else return false;
  })
  asc?: boolean;

  @ApiProperty({ type: Number })
  @IsOptional()
  @Max(100, { message: 'حداکثر تعداد نمایش ۱۰۰ می باشد' })
  @Min(1, { message: 'حداقل تعداد نمایش ۱ می باشد' })
  @IsNumber({}, { message: 'تعداد باید عدد ارسال شود' })
  @Transform((param) => {
    const value = +param.value;
    if (Number.isNaN(value)) return '';
    return value;
  })
  limit?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @Min(1, { message: 'حداقل تعداد نمایش ۱ می باشد' })
  @IsNumber({}, { message: 'تعداد باید عدد ارسال شود' })
  @Transform((param) => {
    const value = +param.value;
    if (Number.isNaN(value)) return '';
    return value;
  })
  page?: number;
}
