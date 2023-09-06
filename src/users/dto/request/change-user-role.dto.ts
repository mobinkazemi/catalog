import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class ChangeUserRoleDto {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  userId: string;
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  roleId: string;
}
