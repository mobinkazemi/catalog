import { RolesEnum } from 'src/common/enums/roles.enum';
import { User } from 'src/users/schema/users.schema';

export class FindUserResponseDto {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  roles: RolesEnum[];

  constructor(data: Partial<User>) {
    this.id = data['_id'].toString();
    this.username = data.username;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.roles = data.roles;
  }
}
