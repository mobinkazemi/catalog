import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectIdOrString } from 'src/common/types/types';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from './dto/request/create-template.dto';
import { RemovePartOfTemplateDto } from './dto/request/remove-template.dto';
import { UpdateTemplateDto } from './dto/request/update-template.dto';
import { Template } from './schema/templates.schema';
import { TemplatesRepository } from './templates.repository';

@Injectable()
export class TemplatesService {
  constructor(private readonly templateRepository: TemplatesRepository) {}
  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    return await this.templateRepository.create(createTemplateDto);
  }

  async createPart(
    createPartOfTemplateDto: CreatePartOfTemplateDto,
    error?: boolean,
  ): Promise<Template> {
    return await this.templateRepository.createPart(createPartOfTemplateDto);
  }

  findAll() {
    return `This action returns all templates`;
  }

  async findOne(id: ObjectIdOrString, error?: boolean) {
    const result = await this.templateRepository.findOne({ id: id as string });

    if (!result && error) throw new NotFoundException();

    return result;
  }

  async fineOneWithFiles(id: ObjectIdOrString, error?: boolean) {
    return await this.templateRepository.findOneWithFiles({ id: id as string });
  }

  async update(updateTemplateDto: UpdateTemplateDto, error?: boolean) {
    await this.findOne(updateTemplateDto.templateId, error);

    return await this.templateRepository.update(updateTemplateDto);
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }

  async removePart(
    data: RemovePartOfTemplateDto,
    error?: boolean,
  ): Promise<Template> {
    return await this.templateRepository.removePart(data);
  }
}
