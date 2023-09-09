import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RepositoryOptionsDto,
  addListOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../common/repository/base.repository';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import * as _ from 'lodash';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import { PartialCategoryType } from './types/partial-category.types';

@Injectable()
export class CategorysRepository extends BaseRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super();
  }

  async findOne<Category>(
    data?: PartialCategoryType,
    options?: RepositoryOptionsDto,
  ): Promise<Category> {
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

    return await this.categoryModel.findOne(query);
  }

  async findAll<Category>(
    data?: PartialCategoryType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Category[]> {
    let query = {};
    if (!data) data = {};
    if (!listOptions) listOptions = {};

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

    const { sort, limit, skip } = this.addListOptions(listOptions);

    return await this.categoryModel.find(
      query,
      {},
      {
        sort,
        limit,
        skip,
      },
    );
  }

  async create<Category>(
    createCategoryDto: PartialCategoryType,
  ): Promise<Category> {
    return await (
      await this.categoryModel.create(createCategoryDto)
    ).toObject();
  }

  async update<Category>(
    findData: PartialCategoryType,
    updateData: PartialCategoryType,
    options?: RepositoryOptionsDto,
  ): Promise<Category> {
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

    return await this.categoryModel.findOneAndUpdate(query, updateData, {
      new: true,
    });
  }

  async remove<Category>(
    findData: PartialCategoryType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    if (findData.id) {
      findData._id = this.convertToObjectId(findData.id);
      delete findData.id;
    }

    if (options?.hardDelete) {
      await this.categoryModel.deleteOne(findData);
    } else {
      await this.categoryModel.updateOne(findData, {
        $set: { deletedAt: Date.now() },
      });
    }
  }
}
