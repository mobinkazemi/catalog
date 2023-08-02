import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindRolesListDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name?: string;
}
