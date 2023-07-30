import { RolesEnum } from '../../../common/enums/roles.enum';
import { User } from '../../../users/schema/users.schema';

export class FindUserResponseDto {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];

  constructor(data: Partial<User>) {
    this.id = data['_id']?.toString();
    this.username = data.username;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.roles = data.roles;
  }
}

export class userWithoutPasswordDto extends User {
  constructor(thisUser: User) {
    super();

    this.id = thisUser['_id']?.toString() || thisUser.id;
    this.username = thisUser.username;
    this.createdAt = thisUser.createdAt;
    this.updatedAt = thisUser.updatedAt;
    this.roles = thisUser.roles;
  }
}
