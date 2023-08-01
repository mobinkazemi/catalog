import { IsString } from 'class-validator';

export class FindOneTemplateRepositoryDto {
  @IsString()
  id?: string;
}

export class FindTemplateRepositoryDto {
  @IsString()
  id?: string;
  @IsString()
  name?: string;
}
