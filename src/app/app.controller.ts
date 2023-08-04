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
import { FindTemplateByIdDto } from 'src/templates/dto/request/find-template.dto';
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
  @ApiParam(FindTemplateByIdDto)
  @Get(':id')
  async findOne(@Param() data: FindTemplateByIdDto) {
    const result = await this.templatesService.fineOneWithFiles(data.id, true);
    return new FindTemplateWithFilesDto(result);
  }
}
