import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { CategorysRepository } from './category.repository';
import { FindCategoryDto } from './dto/find-category.dto';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { FindCategoryListRequestDto } from './dto/request/fnd-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategorysRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    error?: boolean,
  ): Promise<Category> {
    // Check duplicate in here
    const duplicate = await this.categoryRepository.findOne({
      name: createCategoryDto.name,
    });

    if (duplicate && error) throw new ConflictException();
    if (duplicate) return;
    //then create
    return await this.categoryRepository.create(createCategoryDto);
  }

  async findAll(data?: Partial<Category>, options?: addListOptionsDto) {
    return await this.categoryRepository.findAll(data, options);
  }

  async findOne(data?: FindCategoryDto, error?: boolean): Promise<Category> {
    const result = await this.categoryRepository.findOne<Category>(data);

    if (!result && error) throw new NotFoundException();

    return result;
  }

  async update(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { id } = updateCategoryDto;
    delete updateCategoryDto.id;
    return await this.categoryRepository.updateOne({ id }, updateCategoryDto);
  }

  async remove(data: findByIdDto, error?: boolean): Promise<void> {
    const category = await this.findOne({ id: data.id }, error);

    if (!category) return;

    await this.categoryRepository.remove(data.id);
  }
}
