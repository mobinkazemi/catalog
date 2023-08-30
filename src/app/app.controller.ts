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
import { Cacher } from 'src/common/decorators/cache.decorator';
import { findByIdDto } from 'src/common/dto/base-repository-dtos.dto';
import { CachePreKeyEnum } from 'src/common/enums/cachePreKeys.enum';
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
  @Cacher(CachePreKeyEnum.PUBLIC_FIND_TEMPLATE)
  async findOne(@Param() data: findByIdDto) {
    const result = await this.templatesService.findOneWithFilesAndExpiration(
      { id: data.id, expired: false },
      { error: true },
    );
    return result;
  }
}
