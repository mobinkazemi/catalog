import { RolesEnum } from '../../../common/enums/roles.enum';
import { User } from '../../../users/schema/users.schema';

export class FindUserResponseDto {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];

  constructor(data: Partial<User>) {
    this.id = data['_id'].toString();
    this.username = data.username;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.roles = data.roles;
  }
}
