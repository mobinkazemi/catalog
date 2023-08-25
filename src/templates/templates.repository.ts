import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  OptionsDto,
  addListOptionsDto,
  findByIdDto,
} from '../common/dto/base-repository-dtos.dto';
import { BaseRepository } from '../database/repository/base.repository';
import * as _ from 'lodash';
import { BaseSchemaDto } from 'src/database/dto/base.dto';
import { Part, Template, TemplateDocument } from './schema/templates.schema';
import { FindTemplateDto } from './dto/request/find-template.dto';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from './dto/request/create-template.dto';
import { RemovePartOfTemplateDto } from './dto/request/remove-template.dto';
import {
  UpdatePartOfTemplateDto,
  UpdateTemplateDto,
} from './dto/request/update-template.dto';

@Injectable()
export class TemplatesRepository extends BaseRepository {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<TemplateDocument>,
  ) {
    super();
  }

  private expirationHandler(expired: boolean, query: object) {
    const key = 'expiredAt';
    if (expired) {
      query[key] = { $lt: Date.now() };
    } else {
      query[key] = { $gte: Date.now() };
    }

    return query;
  }

  private partItemsToObjectId(part: Partial<Part>): Partial<Part> {
    // convert fileId to ObjectId
    part.fileIds = part.fileIds.map((id) =>
      this.convertToObjectId(id as string),
    );

    // convert pid to ObjectId
    if (part.pid) {
      part.pid = this.convertToObjectId(part.pid as string);
    }

    // convert categoryIds to ObjectId
    if (part.categoryIds?.length) {
      part.categoryIds = part.categoryIds.map((id) =>
        this.convertToObjectId(id as string),
      );
    }

    return part;
  }

  private templateItemsToObjectId(
    template: Partial<Template>,
  ): Partial<Template> {
    if (template.backgroundFileId) {
      template.backgroundFileId = this.convertToObjectId(
        template.backgroundFileId as string,
      );
    }

    if (template.pid) {
      template.pid = this.convertToObjectId(template.pid as string);
    }

    if (template?.parts?.length) {
      template.parts.forEach((part) => {
        // generate an ObjecId for this part
        part._id = new mongoose.Types.ObjectId();
        part = this.partItemsToObjectId(part) as Part;
      });
    }
    return template;
  }

  async update(data: UpdateTemplateDto): Promise<Template> {
    const { templateId } = data;
    delete data.templateId;

    const template = this.templateItemsToObjectId(data);
    return await this.templateModel.findOneAndUpdate(
      {
        _id: this.convertToObjectId(templateId as string),
      },
      { $set: template },
      { new: true },
    );
  }

  async findOne<Template>(
    data?: FindTemplateDto,
    options?: OptionsDto,
  ): Promise<Template> {
    let query = {};
    if (!data) data = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    if (typeof data.expired == 'boolean') {
      query = this.expirationHandler(data.expired, query);
      delete data.expired;
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
    data?: FindTemplateDto,
    options?: OptionsDto,
  ) {
    let query = {};
    if (!data) data = {};

    if (data.id) {
      query['_id'] = this.convertToObjectId(data.id);
      delete data.id;
    }

    if (typeof data.expired == 'boolean') {
      query = this.expirationHandler(data.expired, query);
      delete data.expired;
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
      .populate({
        path: 'parts.fileIds',
        foreignField: '_id',
        localField: 'parts.fileIds',
        model: 'File',
      })
      .populate({
        path: 'parts.categoryIds',
        foreignField: '_id',
        localField: 'parts.categoryIds',
        model: 'Category',
      });

    return result;
  }

  async findAll<Template>(
    data?: FindTemplateDto,
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

    if (typeof data.expired == 'boolean') {
      query = this.expirationHandler(data.expired, query);
      delete data.expired;
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
    const template = this.templateItemsToObjectId(createTemplateDto);
    return await this.templateModel.create(template);
  }

  async remove(data: findByIdDto): Promise<void> {
    await this.templateModel.updateOne(
      {
        _id: this.convertToObjectId(data.id),
      },
      {
        $set: { deletedAt: Date.now() },
      },
    );
  }

  // ----- PART -----

  async createPart(
    createPartOfTemplateDto: CreatePartOfTemplateDto,
  ): Promise<Template> {
    const { templateId } = createPartOfTemplateDto;
    delete createPartOfTemplateDto.templateId;

    const part = this.partItemsToObjectId(createPartOfTemplateDto);

    const result = await this.templateModel.findOneAndUpdate(
      {
        _id: this.convertToObjectId(templateId as string),
      },
      {
        $push: {
          parts: {
            _id: new mongoose.Types.ObjectId(),
            ...part,
          },
        },
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
      (part) => part._id.toString() != partId.toString(),
    );

    await template.save();

    return await this.templateModel.findById(
      this.convertToObjectId(templateId as string),
    );
  }

  async updatePart(data: UpdatePartOfTemplateDto): Promise<Template> {
    const { templateId, partId } = data;
    delete data.templateId;
    delete data.partId;

    let template = await this.templateModel.findOne({
      _id: this.convertToObjectId(templateId as string),
      'parts._id': this.convertToObjectId(partId as string),
    });

    if (!template) return;

    let thisPart = this.partItemsToObjectId(data);
    template.parts = template.parts.map((part) => {
      if (part._id.toString() == partId.toString()) {
        part = {
          ...part,
          ...thisPart,
        };
      }
      return part;
    });

    await template.save();

    return template.toJSON();
  }
}
