import { IsOptional, IsString } from "class-validator";

export class RemoveUserRoleDto {
  @IsString()
  userId: string;
  @IsString()
  roleId: string;
}