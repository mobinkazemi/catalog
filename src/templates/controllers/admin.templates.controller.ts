import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
  Req,
  Query,
} from '@nestjs/common';
import { TemplatesService } from '../templates.service';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from '../dto/request/create-template.dto';
import {
  UpdatePartOfTemplateDto,
  UpdateTemplateDto,
} from '../dto/request/update-template.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/auth/strategy/role.strategy';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  refs,
} from '@nestjs/swagger';
import { FindTemplateWithFilesDto } from '../dto/response/find-one-with-file.dto';
import { RemovePartOfTemplateDto } from '../dto/request/remove-template.dto';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { FindTemplateListRequestDto } from '../dto/request/find-template.dto';
import { FindTemplateListResponseDto } from '../dto/response/find-list.dto';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('templates/admin')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiOperation({ summary: 'Create template' })
  @ApiBody({ type: CreateTemplateDto })
  @Post('create')
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    const result = await this.templatesService.create(createTemplateDto);

    return result;
  }

  @ApiOperation({ summary: 'Delete template' })
  @ApiBody({ type: findByIdDto })
  @Delete('remove')
  async remove(@Body() data: findByIdDto) {
    return await this.templatesService.remove(data, { error: true });
  }

  @ApiOperation({ summary: 'Get template list' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FindTemplateListRequestDto,
  ): Promise<Array<FindTemplateListResponseDto>> {
    const result = await this.templatesService.findAll(data, listOptions);
    return result.map((item) => new FindTemplateListResponseDto(item));
  }

  @ApiOperation({ summary: 'Get template info (with files info)' })
  @Get(':id')
  async findOne(@Param() data: findByIdDto) {
    const result = await this.templatesService.fineOneWithFiles(
      { id: data.id },
      { error: true },
    );
    return new FindTemplateWithFilesDto(result);
  }

  @ApiOperation({ summary: 'Update template' })
  @ApiBody({ type: UpdateTemplateDto })
  @Patch('update')
  async update(@Body() updateTemplateDto: UpdateTemplateDto) {
    return await this.templatesService.update(updateTemplateDto, {
      error: true,
    });
  }

  // ----- PART -----
  @ApiOperation({ summary: 'Create Part' })
  @ApiBody({ type: CreatePartOfTemplateDto })
  @Post('part/create')
  async createPart(@Body() createPartOfTemplateDto: CreatePartOfTemplateDto) {
    return this.templatesService.createPart(createPartOfTemplateDto);
  }

  @ApiOperation({ summary: 'Update part' })
  @Patch('part/update')
  async updatePart(@Body() data: UpdatePartOfTemplateDto) {
    return await this.templatesService.updatePart(data);
  }

  @ApiOperation({ summary: 'Delete Part' })
  @Delete('part/remove')
  async removePart(@Body() data: RemovePartOfTemplateDto) {
    return await this.templatesService.removePart(data);
  }
}
