import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindUserDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @Matches(ObjectIdRegex)
  @IsString()
  id?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ type: Array<String> })
  @IsOptional()
  @IsArray()
  roles?: string[];
}
