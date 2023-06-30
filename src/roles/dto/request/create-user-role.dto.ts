import { IsString } from "class-validator";

export class CreateUserRoleDto {
    @IsString()
    userId:string;
    @IsString()
    roleId:string;
}