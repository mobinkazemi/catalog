import { OmitType, PickType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import { Template } from 'src/templates/schema/templates.schema';

export class FindTemplateDto extends PartialType(Template) {
  // @ApiProperty({ type: String })
  // @IsString()
  // @Matches(ObjectIdRegex)
  // id?: string;
  // @ApiProperty({ type: Date })
  // @IsDate()
  // @IsOptional()
  // expiredAt?: Date;
  expired?: boolean;
}

// -------------------------------------------
// -------------------------------------------
export class FindTemplateListRequestDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  @IsOptional()
  categoryId: ObjectIdOrString;
  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  createdAt: Date;
  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  expiredAt: Date;
  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  deletedAt: Date;
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name: string;
}
