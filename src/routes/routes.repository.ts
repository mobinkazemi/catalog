import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  addListOptionsDto,
  findByIdDto,
  RepositoryOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../database/repository/base.repository';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, RouteDocument } from './schema/routes.schema';
import { FindRouteType } from './types/find-route.types';

@Injectable()
export class RoutesRepository extends BaseRepository {
  constructor(
    @InjectModel(Route.name) private readonly routeModel: Model<RouteDocument>,
  ) {
    super();
  }

  async findOne<Route>(
    data?: FindRouteType,
    options?: RepositoryOptionsDto,
  ): Promise<Route> {
    let query = {};
    if (!data) data = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.routeModel.findOne(query);
  }

  async findAll<Route>(
    data?: FindRouteType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Route[]> {
    let query = {};
    if (!data) data = {};
    if (!listOptions) listOptions = {};

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    const { sort, limit, skip } = this.addListOptions(listOptions);

    return await this.routeModel.find(query, {}, { sort, limit, skip });
  }

  async create(data: FindRouteType): Promise<Route> {
    return await this.routeModel.create(data);
  }

  async remove(data: findByIdDto): Promise<void> {
    await this.routeModel.updateOne(
      {
        _id: this.convertToObjectId(data.id),
      },
      {
        $set: { deletedAt: Date.now() },
      },
    );
  }

  async update(data: UpdateRouteDto): Promise<Route> {
    const { id } = data;
    delete data.id;

    return await this.routeModel.findOneAndUpdate(
      {
        _id: this.convertToObjectId(id as string),
      },
      { $set: data },
      { new: true },
    );
  }
}
