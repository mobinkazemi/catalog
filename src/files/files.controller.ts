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
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/request/create-file.dto';
import { UpdateFileDto } from './dto/request/update-file.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreateResponseDto } from 'src/common/dto/create-response.dto';
import { ConfigService } from '@nestjs/config';
import { defaults } from 'config/configuration';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: defaults.maxFileUploadSize,
    }
  }))
  async create(@UploadedFile() file: Express.Multer.File):Promise<CreateResponseDto> {    
    return await this.filesService.create(file);
  }

  @Get()
  findAll() {
    throw new NotImplementedException();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    throw new NotImplementedException();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new NotImplementedException();
  }
}
