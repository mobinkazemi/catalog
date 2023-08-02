import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindOneTemplateRepositoryDto {
  @IsString()
  @Matches(ObjectIdRegex)
  id?: string;
}

export class FindTemplateRepositoryDto {
  @IsString()
  @Matches(ObjectIdRegex)
  id?: string;
  @IsString()
  name?: string;
}
