import { Injectable, NotFoundException } from '@nestjs/common';
import { findByIdDto } from 'src/common/dto/base-repository-dtos.dto';
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

@Injectable()
export class TemplatesService {
  constructor(private readonly templateRepository: TemplatesRepository) {}
  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    return await this.templateRepository.create(createTemplateDto);
  }

  findAll() {
    return `This action returns all templates`;
  }

  async findOne(id: ObjectIdOrString, error?: boolean) {
    const result = await this.templateRepository.findOne({ id: id as string });

    if (!result && error) throw new NotFoundException();

    return result;
  }

  async fineOneWithFiles(data: FindTemplateDto, error?: boolean) {
    const result = await this.templateRepository.findOneWithFiles({
      id: data.id as string,
    });

    if (!result && error) throw new NotFoundException();

    return result;
  }

  async update(updateTemplateDto: UpdateTemplateDto, error?: boolean) {
    await this.findOne(updateTemplateDto.templateId, error);

    return await this.templateRepository.update(updateTemplateDto);
  }

  async remove(data: findByIdDto, error?: boolean): Promise<void> {
    const template = await this.findOne(data.id, error);

    if (!template) return;

    return await this.templateRepository.remove(data);
  }

  // ----- PARTS -----
  async createPart(
    createPartOfTemplateDto: CreatePartOfTemplateDto,
    error?: boolean,
  ): Promise<Template> {
    return await this.templateRepository.createPart(createPartOfTemplateDto);
  }

  async removePart(
    data: RemovePartOfTemplateDto,
    error?: boolean,
  ): Promise<Template> {
    return await this.templateRepository.removePart(data);
  }

  async updatePart(data: UpdatePartOfTemplateDto): Promise<Template> {
    return await this.templateRepository.updatePart(data);
  }
}
