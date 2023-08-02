import { IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindRoleDto {
  @IsOptional()
  @IsString()
  @Matches(ObjectIdRegex)
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
