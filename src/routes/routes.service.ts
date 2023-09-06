import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { RolesService } from 'src/roles/roles.service';
import { ChangeRouteRoleDto } from './dto/request/change-role.dto';
import { UpdateRouteDto } from './dto/request/update-route.dto';
import { RouteMessagesEnum } from './enums/messages.enums';
import { RoutesRepository } from './routes.repository';
import { Route } from './schema/routes.schema';
import { FindRouteType } from './types/find-route.types';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routeRepository: RoutesRepository,
    private readonly roleService: RolesService,
  ) {}

  async create(
    data: Route,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<ResponseAfterCreateDto> {
    const duplicate = await this.findOne(
      { method: data.method, path: data.path },
      { error: false },
    );

    if (duplicate && serviceOptions?.error) throw new ConflictException();
    if (duplicate) return;

    const result: Route = await this.routeRepository.create({
      ...data,
    });

    return new ResponseAfterCreateDto(result);
  }

  async findOne(
    data: FindRouteType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route> {
    const route = await this.routeRepository.findOne<Route>(data);
    if (!route && serviceOptions?.error)
      throw new NotFoundException(RouteMessagesEnum.ROUTE_NOT_FOUND);
    // if (!route) return null;/

    return route;
  }

  async findAll(
    data?: FindRouteType,
    listOptions?: addListOptionsDto,
  ): Promise<Route[]> {
    return await this.routeRepository.findAll(data, listOptions);
  }

  async update(data: FindRouteType, serviceOptions?: ServiceOptionsDto) {
    await this.findOne({ id: data.id as string }, { error: true });

    if (data?.roles?.length) {
      await Promise.all(
        data.roles.map((item) =>
          this.roleService.findOne({ name: item }, { error: true }),
        ),
      );
    }
    return await this.routeRepository.update(data);
  }

  async addRole(
    data: ChangeRouteRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Route> {
    const route = await this.findOne(
      { id: data.routeId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!route || !role) && !serviceOptions.error) return;

    const rolesList = [...new Set([role.name, ...route.roles])];

    const result = await this.routeRepository.update({
      id: data.routeId,
      roles: rolesList,
    });

    return result;
  }

  async removeRole(
    data: ChangeRouteRoleDto,
    serviceOptions?: ServiceOptionsDto,
  ) {
    const route = await this.findOne(
      { id: data.routeId },
      { error: serviceOptions.error },
    );
    const role = await this.roleService.findOne(
      { id: data.roleId },
      { error: serviceOptions.error },
    );

    if ((!route || !role) && !serviceOptions.error) return;

    const rolesList = route.roles.filter((r) => r != role.name);

    const result = await this.routeRepository.update({
      id: data.routeId,
      roles: rolesList,
    });

    return result;
  }
}
