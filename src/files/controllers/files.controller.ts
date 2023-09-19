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
import { MinioClientService } from 'src/minio/minio.service';
import { File } from '../schema/files.schema';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RedisProxyService } from 'src/redis/redis.service';
import { CachePreKeyEnum } from 'src/common/enums/cachePreKeys.enum';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly minioService: MinioClientService,
    private readonly redisService: RedisProxyService,
    private readonly configService: ConfigService,
  ) {}

  private async fileCacher(readable: Readable, file: File) {
    let ttl = await this.configService.get('file.cacherTTL');
    let buffList: Buffer[] = [];

    const cachedFileKey = CachePreKeyEnum.FILE_CACHER.concat(
      file._id.toString(),
    );
    const cachedFileInfoKey = CachePreKeyEnum.FILE_INFO.concat(
      file._id.toString(),
    );

    readable.on('data', (chunk) => {
      buffList.push(chunk);
    });
    readable.on('end', async () => {
      const wholeBuff = Buffer.concat(buffList);
      await this.redisService.setBuffer(cachedFileKey, wholeBuff, ttl);
      await this.redisService.set(cachedFileInfoKey, JSON.stringify(file), ttl);
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload file' })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: configuration().file.maxUploadSize,
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseAfterCreateDto> {
    /* 
    should be first to also check if minio service is running in background,
    before inserting anything to mongo.
    throws error if minio is not ready.
    */
    await this.minioService.createBucketIfNotExists();

    const { size, originalname, mimetype } = file;
    const savedFile = await this.filesService.create<File>({
      size,
      name: originalname,
      mime: mimetype,
    });

    await this.minioService.uploadFile(file, savedFile._id.toString());

    return new ResponseAfterCreateDto(savedFile);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get file list' })
  @Get()
  findAll() {
    throw new NotImplementedException();
  }

  @Throttle(
    180, // requests
    1000 * 1, // per minute (in miliseconds)
  )
  @ApiOperation({ summary: 'Get file info' })
  @ApiParam(FindFileByIdDto)
  @Get(':id')
  async findOne(@Param() data: FindFileByIdDto, @Res() res: Response) {
    let stream: Readable;
    let fileInfo: File;
    const MAX_FILE_SIZE_CACHE = await this.configService.get(
      'file.maxCacherSize',
    );

    const cachedFileKey = CachePreKeyEnum.FILE_CACHER.concat(data.id);
    const cachedFileInfoKey = CachePreKeyEnum.FILE_INFO.concat(data.id);
    const cachedFile = await this.redisService.getBuffer(cachedFileKey);
    const cachedFileInfo = await this.redisService.get(cachedFileInfoKey);

    if (cachedFile) {
      stream = Readable.from(cachedFile);
      fileInfo = JSON.parse(cachedFileInfo);
    } else {
      fileInfo = await this.filesService.findOne<File>(data, {
        error: true,
      });

      stream = await this.minioService.getFile(fileInfo._id.toString());

      if (fileInfo.size < MAX_FILE_SIZE_CACHE) {
        await this.fileCacher(stream, fileInfo);
      }
    }

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
    await this.filesService.remove(data, { error: true });
    await this.minioService.deleteFile(data.id);
  }
}
