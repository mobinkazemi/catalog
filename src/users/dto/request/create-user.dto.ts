import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(4, { message: 'min username length is 4' })
  @MaxLength(24, { message: 'max username length is 24' })
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8, { message: 'min password length is 8' })
  @MaxLength(24, { message: 'max password length is 24' })
  password: string;
}
