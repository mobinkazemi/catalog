import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindTemplateWithFilesDto } from 'src/templates/dto/response/find-one-with-file.dto';
import { TemplatesService } from 'src/templates/templates.service';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly templatesService: TemplatesService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.templatesService.fineOneWithFiles(id);
    return new FindTemplateWithFilesDto(result);
  }
}
