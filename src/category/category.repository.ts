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
    super(categoryModel);
  }

  async findOne<Category>(
    data?: PartialCategoryType,
    options?: RepositoryOptionsDto,
  ): Promise<Category> {
    return await this.baseFindOne(data as Partial<Category>, options);
  }

  async findAll<Category>(
    data?: PartialCategoryType,
    listOptions?: addListOptionsDto,
    options?: RepositoryOptionsDto,
  ): Promise<Category[]> {
    console.log({
      data,
      listOptions,
      options,
    });

    return await this.baseFindAll(
      data as Partial<Category>,
      listOptions,
      options,
    );
  }

  async create<Category>(
    createCategoryDto: PartialCategoryType,
  ): Promise<Category> {
    return await this.baseCreate(createCategoryDto as Partial<Category>);
  }

  async update<Category>(
    findData: PartialCategoryType,
    updateData: PartialCategoryType,
    options?: RepositoryOptionsDto,
  ): Promise<Category> {
    return await this.baseUpdate<Category>(
      findData,
      updateData as Partial<Category>,
      options,
    );
  }

  async remove<Category>(
    findData: PartialCategoryType,
    options?: RepositoryOptionsDto,
  ): Promise<void> {
    await this.baseRemove(findData, options);
  }
}
