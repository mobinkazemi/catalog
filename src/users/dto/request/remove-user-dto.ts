import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString } from 'src/common/types/types';

export class RemoveUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  id: string;
}
