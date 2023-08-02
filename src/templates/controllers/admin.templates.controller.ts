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
import { ApiBody, ApiProperty, refs } from '@nestjs/swagger';
import { FindTemplateWithFilesDto } from '../dto/response/find-one-with-file.dto';
import { FindOneTemplateRepositoryDto } from '../dto/request/find-template.dto';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('templates/admin')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiBody({ type: CreateTemplateDto })
  @Post('create')
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @Get('list')
  async findAll() {
    return await this.templatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') data: FindOneTemplateRepositoryDto) {
    const result = await this.templatesService.fineOneWithFiles(data.id);
    return new FindTemplateWithFilesDto(result);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return new NotImplementedException();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return new NotImplementedException();
  }
}
