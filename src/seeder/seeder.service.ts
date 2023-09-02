import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisProxyService } from 'src/redis/redis.service';
import { RoutesRedisKeysEnum } from 'src/routes/enums/redis-keys-enums';
import { RoutesService } from 'src/routes/routes.service';
import { RolesEnum } from '../common/enums/roles.enum';
import { Role, RoleDocument } from '../roles/schema/roles.schema';
import { User, UserDocument } from '../users/schema/users.schema';
import * as _ from 'lodash';
import { RouteAuthRedisKeyMaker } from 'src/common/functions/get-route-redis-key.function';
@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisProxyService,
    private readonly routeService: RoutesService,
  ) {
    this.seedRole();
    this.seedAdminUser();
    this.seedRoutes();
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
    const username = this.configService.getOrThrow('superAdminDefaultUsername');
    const password = this.configService.getOrThrow('superAdminDefaultPassword');

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

  async seedRoutes() {
    const routes = await this.routeService.findAll({}, { limit: 1000 });

    await this.redisService.delete({
      pattern: RoutesRedisKeysEnum.PRE_ROUTE_AUTH_KEY,
    });

    await Promise.all(
      routes.map((item) => {
        const key = RouteAuthRedisKeyMaker(item.path, item.method);

        const value = JSON.stringify({
          roles: item.roles,
          isPublic: item.isPublic,
        });

        return this.redisService.set(key, value);
      }),
    );
  }
}
