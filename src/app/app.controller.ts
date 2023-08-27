import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { findByIdDto } from 'src/common/dto/base-repository-dtos.dto';
import { FindTemplateWithFilesDto } from 'src/templates/dto/response/find-one-with-file.dto';
import { TemplatesService } from 'src/templates/templates.service';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly templatesService: TemplatesService,
  ) {}

  @ApiOperation({ summary: 'Get template info' })
  @ApiParam(findByIdDto)
  @Get(':id')
  async findOne(@Param() data: findByIdDto) {
    const result = await this.templatesService.findOneWithFilesAndExpiration(
      { id: data.id, expired: false },
      { error: true },
    );
    return result;
  }
}
