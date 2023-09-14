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
  UseGuards,
} from '@nestjs/common';
import { FilesService } from '../files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseAfterCreateDto } from '../../common/dto/response-after-create.dto';
import { defaults } from 'config/defaults';
import type { Response } from 'express';
import { FindFileByIdDto } from '../dto/request/find-file.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { findByIdDto } from 'src/common/dto/base-repository-dtos.dto';
import configuration from 'config/configuration';
import { AuthGuard } from '@nestjs/passport';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload file' })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: configuration().maxFileUploadSize,
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseAfterCreateDto> {
    const savedFile = await this.filesService.create(file);

    return new ResponseAfterCreateDto(savedFile);
  }

  @UseGuards(AuthGuard('jwt'))
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
      await this.filesService.findOneWithStoredObject(data.id, { error: true });

    res.set({
      'Content-Type': fileInfo.mime,
      'Content-Disposition': `attachment; filename="${fileInfo.name}"`,
    });

    stream.pipe(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remove file' })
  @ApiBody({ type: findByIdDto })
  @Delete('remove')
  async remove(@Body() data: findByIdDto) {
    return await this.filesService.remove(data, { error: true });
  }
}
