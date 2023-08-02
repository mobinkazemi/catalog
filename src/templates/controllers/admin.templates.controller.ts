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
import { CreateTemplateDto } from '../dto/request/create-template.dto';
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
  refs,
} from '@nestjs/swagger';
import { FindTemplateWithFilesDto } from '../dto/response/find-one-with-file.dto';
import { FindOneTemplateRepositoryDto } from '../dto/request/find-template.dto';

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

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get template list' })
  @Get('list')
  async findAll() {
    throw new NotImplementedException();
  }

  @ApiOperation({ summary: 'Get template info (with files info)' })
  @Get(':id')
  async findOne(@Param('id') data: FindOneTemplateRepositoryDto) {
    const result = await this.templatesService.fineOneWithFiles(data.id);
    return new FindTemplateWithFilesDto(result);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update template' })
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return new NotImplementedException();
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update part' })
  @Patch('update/part/:id')
  updatePart(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return new NotImplementedException();
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Delete template' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return new NotImplementedException();
  }
}
