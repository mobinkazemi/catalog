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
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { RolesGuard } from 'src/auth/strategy/role.strategy';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { FindTemplateWithFilesDto } from '../dto/response/find-one-with-file.dto';
import { RemovePartOfTemplateDto } from '../dto/request/remove-template.dto';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { FindTemplateListRequestDto } from '../dto/request/find-template.dto';
import { FindTemplateListResponseDto } from '../dto/response/find-list.dto';
import { PartialTemplateType } from '../types/partial-template.type';
import { ResponseAfterCreateDto } from 'src/common/dto/response-after-create.dto';

// @Roles(RolesEnum.ADMIN)
// @UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('templates/admin')
export class TemplateAdminController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiOperation({ summary: 'Create template' })
  @ApiBody({ type: CreateTemplateDto })
  @Post('create')
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    const result = await this.templatesService.create(createTemplateDto);

    return new ResponseAfterCreateDto(result);
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
    const result = await this.templatesService.findOneWithFiles(
      { id: data.id },
      { error: true },
    );
    // return new FindTemplateWithFilesDto(result);
    return result;
  }

  @ApiOperation({ summary: 'Update template' })
  @ApiBody({ type: UpdateTemplateDto })
  @Patch('update')
  async update(@Body() updateTemplateDto: UpdateTemplateDto) {
    const { templateId: id } = updateTemplateDto;
    delete updateTemplateDto.templateId;

    return await this.templatesService.update(
      { id: id as string },
      updateTemplateDto as PartialTemplateType,
    );
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
