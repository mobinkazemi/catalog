import { IsArray, IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';
import { User } from '../../../users/schema/users.schema';

export class FindUserDto {
  @IsOptional()
  @Matches(ObjectIdRegex)
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
