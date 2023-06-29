import { IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
  @IsString()
  @MinLength(8,{message: 'min username length is 8'})
  @MaxLength(12,{message: 'max username length is 24'})
  username: string;

  @IsString()
  @MinLength(8, {message: 'min password length is 8'})
  @MaxLength(24, {message: 'max password length is 24'})
  password: string;
}