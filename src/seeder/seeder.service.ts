import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { Role, RoleDocument } from 'src/roles/schema/roles.schema';
import { User, UserDocument } from 'src/users/schema/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    this.seedRole();
    this.seedAdminUser();
  }

  async seedRole() {
    const admin_name = RolesEnum.ADMIN;

    const exist = await this.roleModel.findOne({
      name: admin_name,
      deletedAt: { $exists: false },
    });

    if (!exist) await this.roleModel.create({ name: admin_name });
  }

  async seedAdminUser() {
    console.log('here');

    const admin_role = RolesEnum.ADMIN;
    const username = 'super_admin';

    const exist = await this.userModel.findOne({
      username,
      roles: admin_role,
      deletedAt: null
    });

    if (!exist) {
      await this.userModel.create({
        username,
        roles: [admin_role],
        password: process.env.ADMIN_PASSWORD,
      });
    }
  }
}
