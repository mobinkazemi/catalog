import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class findByIdDto {
  id: string;
}

export class OptionsDto {
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
