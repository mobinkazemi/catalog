import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { ServiceOptionsDto } from 'src/common/dto/service-options.dto';
import { BaseService } from 'src/common/services/base.service';
import { CategorysRepository } from './category.repository';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { CategoryMessagesEnum } from './enums/messages.enum';
import { Category } from './schema/category.schema';
import { PartialCategoryType } from './types/partial-category.types';

@Injectable()
export class CategoryService extends BaseService {
  constructor(private readonly categoryRepository: CategorysRepository) {
    super();
  }

  async create<Category>(
    data: PartialCategoryType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Category> {
    // Check duplicate in here
    const duplicate = await this.findOne(data, { show: 'all' });

    if (duplicate && serviceOptions?.error)
      throw new ConflictException(CategoryMessagesEnum.CATEGORY_CONFLICT_NAME);
    if (duplicate) return;

    //then create
    return await this.categoryRepository.create<Category>(data);
  }

  async findAll<Category>(
    data: PartialCategoryType,
    listOptions?: addListOptionsDto,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Category[]> {
    return await this.categoryRepository.findAll(
      data,
      listOptions,
      serviceOptions,
    );
  }

  async findOne<Category>(
    data?: PartialCategoryType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Category> {
    const result = await this.categoryRepository.findOne<Category>(data);
    if (!result && serviceOptions?.error)
      throw new NotFoundException(CategoryMessagesEnum.CATEGORY_NOT_FOUND);

    return result;
  }

  async update<Category>(
    findData: PartialCategoryType,
    updateData: PartialCategoryType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<Category> {
    return await this.categoryRepository.updateOne(
      findData,
      updateData,
      serviceOptions,
    );
  }

  async remove<Category>(
    data: PartialCategoryType,
    serviceOptions?: ServiceOptionsDto,
  ): Promise<void> {
    const category = await this.findOne(data, serviceOptions);

    if (!category) return;

    await this.categoryRepository.remove(data.id);
  }
}
