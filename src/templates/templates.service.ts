import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from 'src/category/schema/category.schema';
import {
  addListOptionsDto,
  findByIdDto,
  RepositoryOptionsDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { ObjectIdOrString } from 'src/common/types/types';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from './dto/request/create-template.dto';
import { FindTemplateDto } from './dto/request/find-template.dto';
import { RemovePartOfTemplateDto } from './dto/request/remove-template.dto';
import {
  UpdatePartOfTemplateDto,
  UpdateTemplateDto,
} from './dto/request/update-template.dto';
import { Template } from './schema/templates.schema';
import { TemplatesRepository } from './templates.repository';
import * as _ from 'lodash';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { PartialTemplateType } from './types/partial-template.type';
import { TemplateMessagesEnum } from './enums/messages.enum';
import { BaseService } from 'src/common/services/base.service';
import { RedisProxyService } from 'src/redis/redis.service';
import { CachePreKeyEnum } from 'src/common/enums/cachePreKeys.enum';
@Injectable()
export class TemplatesService extends BaseService {
  constructor(
    private readonly templateRepository: TemplatesRepository,
    private readonly redis: RedisProxyService,
  ) {
    super();
  }

  private categoriesCollector(data: Template): Template {
    let allCategories = new Map();
    data?.parts?.forEach((item) => {
      if (item?.categoryIds?.length) {
        item.categoryIds.forEach((category: any) => {
          allCategories.set(
            category._id.toString(),
            _.pick(category, ['_id', 'name']),
          );
        });
      }
    });

    data['allPartCategories'] = [...allCategories.values()];

    return data;
  }

  async create<Template>(
    data: PartialTemplateType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Template> {
    const result = await this.templateRepository.create<Template>(data);

    return result;
  }

  async findAll<Template>(
    data: PartialTemplateType,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Template[]> {
    return await this.templateRepository.findAll(
      data,
      listOptions,
      serviceOptions,
    );
  }

  async findOne<Template>(
    data: Partial<Template>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Template> {
    const result = await this.templateRepository.findOne<Template>(
      data,
      serviceOptions as RepositoryOptionsDto,
    );

    if (!result && serviceOptions?.error) {
      throw new NotFoundException(TemplateMessagesEnum.TEMPLATE_NOT_FOUND);
    }

    return result;
  }

  async findOneWithFiles(
    data: FindTemplateDto,
    serviceOptions?: ServiceOptionsDto,
  ) {
    let result = await this.templateRepository.findOneWithFiles({
      ...data,
      id: data.id as string,
    });

    if (!result && serviceOptions?.error) throw new NotFoundException();

    result = this.categoriesCollector(result as Template);

    return result;
  }

  async findOneWithFilesAndExpiration(
    data: FindTemplateDto,
    serviceOptions?: ServiceOptionsDto,
  ) {
    delete data.expired;

    let result = (await this.findOneWithFiles(
      data,
      serviceOptions,
    )) as Template;

    if (result['expiredAt'] && result['expiredAt'] < new Date()) {
      throw new GoneException();
    }

    result = this.categoriesCollector(result);

    return result;
  }

  async update<Template>(
    findData: PartialTemplateType,
    updateData: Partial<Template>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Template> {
    const result = await this.templateRepository.update<Template>(
      findData,
      updateData,
    );

    // Delete template cache
    if (result) {
      const prekey = CachePreKeyEnum.PUBLIC_FIND_TEMPLATE;
      const templateId = findData?.id || findData._id.toString();

      const relatedKeys = await this.redis.getKeys({ pattern: prekey });
      const targetKey = relatedKeys.filter((key) =>
        key.includes(templateId),
      )[0];

      this.redis.delete({ key: targetKey });
    }

    return result;
  }

  async remove<Template>(
    data: Partial<Template>,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    return await this.templateRepository.remove<Template>(data);
  }

  // ----- PARTS -----
  async createPart(
    createPartOfTemplateDto: CreatePartOfTemplateDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Template> {
    return await this.templateRepository.createPart(createPartOfTemplateDto);
  }

  async removePart(
    data: RemovePartOfTemplateDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Template> {
    return await this.templateRepository.removePart(data);
  }

  async updatePart(data: UpdatePartOfTemplateDto): Promise<Template> {
    return await this.templateRepository.updatePart(data);
  }
}
