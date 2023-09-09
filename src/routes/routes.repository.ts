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
    super();
  }

  async findOne<Route>(
    data?: PartialRouteType,
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
    data?: PartialRouteType,
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

  async create<Route>(data: PartialRouteType): Promise<Route> {
    return (await this.routeModel.create(data)).toObject();
  }

  async remove<Route>(
    findData: PartialRouteType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    if (findData.id) {
      findData._id = this.convertToObjectId(findData.id);
      delete findData.id;
    }

    if (options?.hardDelete) {
      await this.routeModel.deleteOne(findData);
    } else {
      await this.routeModel.updateOne(findData, {
        $set: { deletedAt: Date.now() },
      });
    }
  }

  async update<Route>(
    findData: PartialRouteType,
    updateData: PartialRouteType,
    options?: RepositoryOptionsDto,
  ): Promise<Route> {
    let query = {};

    if (findData.id) {
      query['_id'] = this.convertToObjectId(findData.id);
      delete findData.id;
    }

    query = {
      ...query,
      ...findData,
      deletedAt: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.routeModel.findOneAndUpdate(query, updateData, {
      new: true,
    });
  }
}
