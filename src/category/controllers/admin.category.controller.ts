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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { RolesGuard } from 'src/auth/strategy/role.strategy';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';
// import { RolesEnum } from 'src/common/enums/roles.enum';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { FindCategoryListRequestDto } from '../dto/request/find-category.dto';
import { Category } from '../schema/category.schema';

// @Roles(RolesEnum.ADMIN)
// @UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('category/admin')
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @Post('create')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryService.create(createCategoryDto, {
      error: true,
    });

    return new ResponseAfterCreateDto(result);
  }

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

  @ApiOperation({ summary: 'Delete category' })
  @ApiBody({ type: findByIdDto })
  @Delete('remove')
  async remove(@Body() data: findByIdDto) {
    return await this.categoryService.remove<Category>(
      { id: data.id },
      { error: true },
    );
  }
}
