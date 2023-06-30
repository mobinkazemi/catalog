import { IsOptional, IsString } from "class-validator";

export class FindRoleDto{
    @IsOptional()
    @IsString()
    id?:string;

    @IsOptional()
    @IsString()
    name?:string;
}