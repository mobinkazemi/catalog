import { OmitType, PickType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
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
