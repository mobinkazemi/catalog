import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class CreateUserRoleDto {
  @Matches(ObjectIdRegex)
  @IsString()
  userId: string;
  @Matches(ObjectIdRegex)
  @IsString()
  roleId: string;
}
