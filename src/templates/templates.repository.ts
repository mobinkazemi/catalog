import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OptionsDto,
  addListOptionsDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../database/repository/base.repository';
import * as _ from 'lodash';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { Template, TemplateDocument } from './schema/templates.schema';
import {
  FindOneTemplateRepositoryDto,
  FindTemplateRepositoryDto,
} from './dto/find-template.dto';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplatesRepository extends BaseRepository {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<TemplateDocument>,
  ) {
    super();
  }

  async findOne<User>(
    data?: FindOneTemplateRepositoryDto,
    options?: OptionsDto,
  ): Promise<User> {
    let query = {};
    if (!data) data = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    query = {
      ...query,
      ...data,
      isDeleted: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    return await this.templateModel.findOne(query);
  }

  async findAll<User>(
    data?: FindTemplateRepositoryDto,
    listOptions?: addListOptionsDto,
    options?: OptionsDto,
  ): Promise<User[]> {
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
      isDeleted: null,
    };

    if (options) {
      query = this.addOptions(query, options);
    }

    const { sort, limit, skip } = this.addListOptions(listOptions);

    return await this.templateModel.find(
      query,
      {},
      {
        sort,
        limit,
        skip,
      },
    );
  }

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    return await this.templateModel.create(createTemplateDto);
  }

  //   async updateOne<User>(
  //     data: FindUserDto,
  //     updateData: UpdateUserDto & BaseSchemaDto,
  //   ): Promise<User> {
  //     let query = {};

  //     if (data.id) {
  //       query['_id'] = this.convertToObjectId(data.id);
  //       delete data.id;
  //     }

  //     query = {
  //       ...query,
  //       ...data,
  //       isDeleted: null,
  //     };

  //     return await this.templateModel.findOneAndUpdate(query, updateData, {
  //       new: true,
  //     });
  //   }
}
