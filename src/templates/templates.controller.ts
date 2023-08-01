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
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  CreateTemplateDto,
  CreateTemplateDtoExample,
} from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/auth/strategy/role.strategy';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiProperty, refs } from '@nestjs/swagger';

@Roles(RolesEnum.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiBody({ type: CreateTemplateDto })
  @Post('create')
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @Get('list')
  findAll() {
    return new NotImplementedException();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return new NotImplementedException();
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
