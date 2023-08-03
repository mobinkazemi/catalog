import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
} from './dto/request/find-template.dto';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from './dto/request/create-template.dto';
import { RemovePartOfTemplateDto } from './dto/request/remove-template.dto';

@Injectable()
export class TemplatesRepository extends BaseRepository {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<TemplateDocument>,
  ) {
    super();
  }

  async findOne<Template>(
    data?: FindOneTemplateRepositoryDto,
    options?: OptionsDto,
  ): Promise<Template> {
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

    const result = await this.templateModel.findOne<Template>(query);

    return result;
  }

  async findOneWithFiles<Template>(
    data?: FindOneTemplateRepositoryDto,
    options?: OptionsDto,
  ) {
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

    const result = await this.templateModel
      .findOne<Template>(query, {}, { lean: true })
      .populate('backgroundFileId')
      // .populate('pid')
      .populate({
        path: 'parts.fileId',
        foreignField: '_id',
        localField: 'parts.fileId',
        model: 'File',
      });

    return result;
  }

  async findAll<Template>(
    data?: FindTemplateRepositoryDto,
    listOptions?: addListOptionsDto,
    options?: OptionsDto,
  ): Promise<Template[]> {
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
    if (createTemplateDto.backgroundFileId) {
      createTemplateDto.backgroundFileId = this.convertToObjectId(
        createTemplateDto.backgroundFileId as string,
      );
    }
    if (createTemplateDto.pid) {
      createTemplateDto.pid = this.convertToObjectId(
        createTemplateDto.pid as string,
      );
    }
    if (createTemplateDto?.parts?.length) {
      createTemplateDto.parts.forEach((part) => {
        if (part.pid) {
          part.pid = this.convertToObjectId(part.pid as string);
        }
        part.fileId = this.convertToObjectId(part.fileId as string);
        part._id = new mongoose.Types.ObjectId();
      });
    }

    return await this.templateModel.create(createTemplateDto);
  }

  async createPart(
    createPartOfTemplateDto: CreatePartOfTemplateDto,
  ): Promise<Template> {
    const { templateId } = createPartOfTemplateDto;
    delete createPartOfTemplateDto.templateId;

    const result = await this.templateModel.findOneAndUpdate(
      {
        _id: this.convertToObjectId(templateId as string),
      },
      {
        $push: { parts: createPartOfTemplateDto },
      },
      { new: true, lean: true },
    );

    return result;
  }

  async removePart(
    removePartOfTemplateDto: RemovePartOfTemplateDto,
  ): Promise<Template> {
    const { templateId, partId } = removePartOfTemplateDto;

    let template = await this.templateModel.findById(
      this.convertToObjectId(templateId as string),
    );

    template.parts = template.parts.filter(
      (part) => part.id != partId.toString(),
    );

    template.save();

    return await this.templateModel.findById(
      this.convertToObjectId(templateId as string),
    );
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
  //       deletedAt: null,
  //     };

  //     return await this.templateModel.findOneAndUpdate(query, updateData, {
  //       new: true,
  //     });
  //   }
}
