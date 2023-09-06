import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { ObjectIdRegex } from 'src/common/constants/objectId-regex.constant';

export class ChangeRouteRoleDto {
  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  routeId: string;

  @ApiProperty({ type: String })
  @Matches(ObjectIdRegex)
  @IsString()
  roleId: string;
}
