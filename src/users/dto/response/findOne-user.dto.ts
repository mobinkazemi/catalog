import { ObjectIdType } from 'src/common/types/types';
import { User } from '../../../users/schema/users.schema';

export class FindUserResponseDto {
  _id: ObjectIdType;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];

  constructor(data: Partial<User>) {
    this._id = data._id;
    this.username = data.username;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.roles = data.roles;
  }
}

export class userWithoutPasswordDto extends User {
  constructor(thisUser: User) {
    super();

    this._id = thisUser['_id'];
    this.username = thisUser.username;
    this.createdAt = thisUser.createdAt;
    this.updatedAt = thisUser.updatedAt;
    this.roles = thisUser.roles;
  }
}
