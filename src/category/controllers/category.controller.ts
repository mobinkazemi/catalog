import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotImplementedException,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { FindCategoryListRequestDto } from '../dto/request/fnd-category.dto';
import { FindCategoryResponseDto } from '../dto/response/find-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @Post('create')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryService.create(createCategoryDto, true);

    return new FindCategoryResponseDto(result);
  }

  @ApiQuery({ type: addListOptionsDto })
  @ApiQuery({ type: FindCategoryListRequestDto })
  @ApiOperation({ summary: 'Get category list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FindCategoryListRequestDto,
  ): Promise<Array<FindCategoryResponseDto>> {
    const result = await this.categoryService.findAll(data, listOptions);

    return result.map((item) => new FindCategoryResponseDto(item));
  }

  @ApiOperation({ summary: 'Get category info' })
  @Get(':id')
  async findOne(@Param() data: findByIdDto) {
    const result = await this.categoryService.findOne(data, true);
    return new FindCategoryResponseDto(result);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiBody({ type: findByIdDto })
  @Delete('remove')
  async remove(@Body() data: findByIdDto) {
    return await this.categoryService.remove(data);
  }
}
