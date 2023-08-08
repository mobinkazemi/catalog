import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesEnum } from '../common/enums/roles.enum';
import { Role, RoleDocument } from '../roles/schema/roles.schema';
import { User, UserDocument } from '../users/schema/users.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
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
    const admin_role = RolesEnum.ADMIN;
    const username = this.configService.get('superAdminDefaultUsername');
    const password = this.configService.get('superAdminDefaultPassword');

    const exist = await this.userModel.findOne({
      username,
      roles: admin_role,
      deletedAt: null,
    });

    if (!exist) {
      await this.userModel.create({
        username,
        password,
        roles: [admin_role],
      });
    }
  }
}
