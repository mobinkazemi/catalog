import { IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class RemoveUserRoleDto {
  @Matches(ObjectIdRegex)
  @IsString()
  userId: string;
  @Matches(ObjectIdRegex)
  @IsString()
  roleId: string;
}
