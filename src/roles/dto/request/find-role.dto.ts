import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindRoleDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Matches(ObjectIdRegex)
  id?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name?: string;
}
