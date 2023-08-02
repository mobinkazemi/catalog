import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class FindOneTemplateRepositoryDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  id?: string;
}

export class FindTemplateByIdDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  id: string;
}

export class FindTemplateRepositoryDto {
  @ApiProperty({ type: String })
  @IsString()
  @Matches(ObjectIdRegex)
  id?: string;
  @ApiProperty({ type: String })
  @IsString()
  name?: string;
}
