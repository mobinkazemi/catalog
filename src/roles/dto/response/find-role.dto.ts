import { PartialType } from '@nestjs/mapped-types';
import { Role } from 'src/roles/schema/roles.schema';

export class findRoleResponseDto extends PartialType(Role) {
  constructor(data?: Partial<Role>) {
    super();
    if (!data) data = {};

    this.id = data._id.toString();
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.ord = data.ord;
    this.pid = data.pid;
    this.updatedAt = data.updatedAt;
  }
}
