import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  findByIdDto,
  RepositoryOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../common/repository/base.repository';
import { UpdateRouteDto } from './dto/request/update-route.dto';
import { Route, RouteDocument } from './schema/routes.schema';
import { PartialRouteType } from './types/partial-route.type';

@Injectable()
export class RoutesRepository extends BaseRepository {
  constructor(
    @InjectModel(Route.name) private readonly routeModel: Model<RouteDocument>,
  ) {
    super(routeModel);
  }

  async findOne<Route>(
    data?: PartialRouteType,
    options?: RepositoryOptionsDto,
  ): Promise<Route> {
    return await this.baseFindOne(data as Partial<Route>, options);
  }

  async findAll<Route>(
    data?: PartialRouteType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Route[]> {
    return await this.baseFindAll(data as Partial<Route>, listOptions, options);
  }

  async create<Route>(data: PartialRouteType): Promise<Route> {
    return await this.baseCreate(data as Partial<Route>);
  }

  async remove<Route>(
    findData: PartialRouteType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    return await this.baseRemove(findData as Partial<Route>, options);
  }

  async update<Route>(
    findData: PartialRouteType,
    updateData: PartialRouteType,
    options?: RepositoryOptionsDto,
  ): Promise<Route> {
    return await this.baseUpdate(
      findData as Partial<Route>,
      updateData as Partial<Route>,
      options,
    );
  }
}
