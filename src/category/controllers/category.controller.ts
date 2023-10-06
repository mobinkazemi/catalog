import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { CategoryService } from '../category.service';
import { FindCategoryListRequestDto } from '../dto/request/find-category.dto';
import { Category } from '../schema/category.schema';

// @UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get category list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FindCategoryListRequestDto,
  ): Promise<Array<Category>> {
    return await this.categoryService.findAll(data, listOptions);
  }

  @ApiOperation({ summary: 'Get category info' })
  @Get(':id')
  async findOne(@Param() data: findByIdDto) {
    return await this.categoryService.findOne(data, {
      error: true,
    });
  }
}
