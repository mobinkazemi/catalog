import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindFileByIdDto {
  @IsString()
  @Matches(ObjectIdRegex)
  id: string;
}
