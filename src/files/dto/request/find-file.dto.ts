import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindFileByIdDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  id: string;
}
