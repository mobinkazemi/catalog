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
} from '@nestjs/common';
import { TemplatesService } from '../templates.service';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from '../dto/request/create-template.dto';
import { UpdateTemplateDto } from '../dto/request/update-template.dto';
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
import { FindOneTemplateRepositoryDto } from '../dto/request/find-template.dto';
import { RemovePartOfTemplateDto } from '../dto/request/remove-template.dto';

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
    return this.templatesService.create(createTemplateDto);
  }

  @ApiOperation({ summary: 'Create Part of template' })
  @ApiBody({ type: CreatePartOfTemplateDto })
  @Post('part/create')
  async createPart(@Body() createPartOfTemplateDto: CreatePartOfTemplateDto) {
    return this.templatesService.createPart(createPartOfTemplateDto);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get template list' })
  @Get('list')
  async findAll() {
    throw new NotImplementedException();
  }

  @ApiQuery({ type: FindOneTemplateRepositoryDto })
  @ApiOperation({ summary: 'Get template info (with files info)' })
  @Get(':id')
  async findOne(@Param() data: FindOneTemplateRepositoryDto) {
    const result = await this.templatesService.fineOneWithFiles(data.id);
    return new FindTemplateWithFilesDto(result);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update template' })
  @Patch('update/:id')
  update(@Param() id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return new NotImplementedException();
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update part' })
  @Patch('part/update/:id')
  updatePart(
    @Param() id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return new NotImplementedException();
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Delete template' })
  @Delete('remove/:id')
  remove(@Body() id: string) {
    return new NotImplementedException();
  }

  @ApiOperation({ summary: 'Delete template Part' })
  @Delete('part/remove/:id')
  async removePart(@Body() data: RemovePartOfTemplateDto) {
    return await this.templatesService.removePart(data);
  }
}
