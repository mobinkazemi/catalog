import { IsOptional, IsString } from "class-validator"

export class FindUserDto {
    @IsOptional()
    @IsString()
    id?:string

    @IsOptional()
    @IsString()
    username?:string
}