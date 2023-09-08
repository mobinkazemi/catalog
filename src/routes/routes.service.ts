import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { BaseService } from 'src/common/services/base.service';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/schema/roles.schema';
import { ChangeRouteRoleDto } from './dto/request/change-role.dto';
import { UpdateRouteDto } from './dto/request/update-route.dto';
import { RouteMessagesEnum } from './enums/messages.enums';
import { RoutesRepository } from './routes.repository';
import { Route } from './schema/routes.schema';
import { PartialRouteType } from './types/partial-route.type';

@Injectable()
export class RoutesService extends BaseService {
  constructor(
    private readonly routeRepository: RoutesRepository,
    private readonly roleService: RolesService,
  ) {
    super();
  }

  async create<Route>(
    data: PartialRouteType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route> {
    const duplicate = await this.findOne(
      { method: data.method, path: data.path },
      { error: false },
    );

    if (duplicate && serviceOptions?.error) {
      //TODO msg
      throw new ConflictException();
    }
    if (duplicate) return;

    const result = await this.routeRepository.create<Route>({
      ...data,
    });

    return result;
  }

  async findOne<Route>(
    data: Partial<Route>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route> {
    const route = await this.routeRepository.findOne<Route>(
      data,
      serviceOptions,
    );

    if (!route && serviceOptions?.error) {
      throw new NotFoundException(RouteMessagesEnum.ROUTE_NOT_FOUND);
    }

    return route;
  }

  async findAll<Route>(
    data: Partial<Route>,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route[]> {
    return await this.routeRepository.findAll(
      data,
      listOptions,
      serviceOptions,
    );
  }

  async update<Route>(
    findData: PartialRouteType,
    updateData: PartialRouteType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route> {
    await this.findOne({ id: findData.id as string }, { error: true });

    if (updateData?.roles?.length) {
      await Promise.all(
        updateData.roles.map((item) =>
          this.roleService.findOne({ name: item }, { error: true }),
        ),
      );
    }
    return await this.routeRepository.update(
      findData,
      updateData,
      serviceOptions,
    );
  }

  async remove<Route>(
    data: PartialRouteType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    await this.routeRepository.remove(data);
  }

  async addRole(
    data: ChangeRouteRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route> {
    const route = await this.findOne<Route>(
      { id: data.routeId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne<Role>(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!route || !role) && !serviceOptions.error) return;

    const rolesList = [...new Set([role.name, ...route.roles])];

    const result = await this.routeRepository.update<Route>(
      {
        id: data.routeId,
      },
      {
        roles: rolesList,
      },
    );

    return result;
  }

  async removeRole(
    data: ChangeRouteRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ) {
    const route = await this.findOne<Route>(
      { id: data.routeId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne<Role>(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!route || !role) && !serviceOptions.error) return;

    const rolesList = route.roles.filter((r) => r != role.name);

    const result = await this.routeRepository.update(
      {
        id: data.routeId,
      },
      {
        roles: rolesList,
      },
    );

    return result;
  }
}
