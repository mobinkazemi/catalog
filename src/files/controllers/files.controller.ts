import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotImplementedException,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FilesService } from '../files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseAfterCreateDto } from '../../common/dto/response-after-create.dto';
import { defaults } from 'config/configuration';
import type { Response } from 'express';
import { FindFileByIdDto } from '../dto/request/find-file.dto';
import { ApiExcludeEndpoint, ApiOperation, ApiParam } from '@nestjs/swagger';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Upload file' })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: defaults.maxFileUploadSize,
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseAfterCreateDto> {
    const savedFile = await this.filesService.create(file);
    return new ResponseAfterCreateDto(savedFile);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get file list' })
  @Get()
  findAll() {
    throw new NotImplementedException();
  }

  @ApiOperation({ summary: 'Get file info' })
  @ApiParam(FindFileByIdDto)
  @Get(':id')
  async findOne(@Param() data: FindFileByIdDto, @Res() res: Response) {
    const { fileInfo, stream } =
      await this.filesService.findOneWithStoredObject(data.id, true);

    res.set({
      'Content-Type': fileInfo.mime,
      'Content-Disposition': `attachment; filename="${fileInfo.name}"`,
    });

    stream.pipe(res);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Remove file' })
  @Delete(':id')
  remove(@Param() id: string) {
    throw new NotImplementedException();
  }
}
