import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OptionsDto,
  findByIdDto,
  addListOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../database/repository/base.repository';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import * as _ from 'lodash';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import { FindCategoryDto } from './dto/find-category.dto';

@Injectable()
export class CategorysRepository extends BaseRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super();
  }

  async findOne<Category>(
    data?: FindCategoryDto,
    options?: OptionsDto,
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
    data?: FindCategoryDto,
    listOptions?: addListOptionsDto,
    options?: OptionsDto,
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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(createCategoryDto);
  }

  async updateOne<Category>(
    data: FindCategoryDto,
    updateData: UpdateCategoryDto & BaseSchemaDto,
  ): Promise<Category> {
    let query = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    query = {
      ...query,
      ...data,
      deletedAt: null,
    };

    return await this.categoryModel.findOneAndUpdate(query, updateData, {
      new: true,
    });
  }

  async remove(id: ObjectIdOrString) {
    await this.categoryModel.updateOne(
      {
        _id: this.convertToObjectId(id as string),
      },
      { $set: { deletedAt: Date.now() } },
    );
  }
}
