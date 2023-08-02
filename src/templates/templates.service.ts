import { Injectable } from '@nestjs/common';
import { ObjectIdOrString } from 'src/common/types/types';
import { CreateTemplateDto } from './dto/request/create-template.dto';
import { UpdateTemplateDto } from './dto/request/update-template.dto';
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

  async findOne(id: ObjectIdOrString) {
    return await this.templateRepository.findOne({ id: id as string });
  }

  async fineOneWithFiles(id: ObjectIdOrString) {
    return await this.templateRepository.findOneWithFiles({ id: id as string });
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
