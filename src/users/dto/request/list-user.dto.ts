import { IsArray, IsOptional, IsString } from "class-validator"
import { User } from "src/users/schema/users.schema";

export class FindUserDto {
    @IsOptional()
    @IsString()
    id?:string

    @IsOptional()
    @IsString()
    username?:string;

    @IsOptional()
    @IsArray()
    roles?:string[];
}