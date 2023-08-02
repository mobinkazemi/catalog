import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { ObjectIdOrString } from 'src/common/types/types';

export class RemoveUserDto {
  @IsString()
  @Matches(ObjectIdRegex)
  id: ObjectIdOrString;
}
