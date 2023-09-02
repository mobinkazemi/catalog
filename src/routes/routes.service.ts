import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addListOptionsDto } from 'src/common/dto/base-repository-dtos.dto';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { RolesService } from 'src/roles/roles.service';
import { UpdateRouteDto } from './dto/update-route.dto';
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

  async update(data: UpdateRouteDto, serviceOptions?: ServiceOptionsDto) {
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
}
