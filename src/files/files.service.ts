import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResponseDto } from 'src/common/dto/create-response.dto';
import { MinioClientService } from 'src/minio/minio.service';
import { CreateFileDto } from './dto/request/create-file.dto';
import { UpdateFileDto } from './dto/request/update-file.dto';
import { File, FileDocument } from './schema/files.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly fileUpload: MinioClientService,
  ) {}

  async create(file: Express.Multer.File):Promise<CreateResponseDto> {
    const { size, originalname, mimetype } = file;
    const result = await this.fileModel.create({
      size, name: originalname, mime:mimetype
    });

    await this.fileUpload.createBucketIfNotExists();
    await this.fileUpload.uploadFile(file, result.id);

    return new CreateResponseDto(result);
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
