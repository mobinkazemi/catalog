import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { minioErrorEnums } from './dto/minio-errors.enums';

@Injectable()
export class MinioClientService {
  private minioClient: Minio.Client;
  private bucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('minio.host'),
      port: Number(this.configService.get('minio.port')),
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
      useSSL: false,
    });
    this.bucketName = this.configService.get('minio.bucket');
  }

  async ping() {
    try {
      // throws error if minio service is not running in background
      await this.minioClient.bucketExists('test');

      return true;
    } catch (error) {
      return false;
    }
  }
  async createBucketIfNotExists() {
    if (!(await this.ping()))
      throw new InternalServerErrorException(minioErrorEnums.NO_CONNECTION);
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async uploadFile(file: Express.Multer.File, fileName: string) {
    if (!(await this.ping()))
      throw new InternalServerErrorException(minioErrorEnums.NO_CONNECTION);

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFileUrl(fileName: string) {
    if (!(await this.ping()))
      throw new InternalServerErrorException(minioErrorEnums.NO_CONNECTION);

    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }

  async getFile(objectName: string, realFileName: string) {
    if (!(await this.ping()))
      throw new InternalServerErrorException(minioErrorEnums.NO_CONNECTION);

    try {
      return await this.minioClient.getObject(this.bucketName, objectName);
    } catch (error) {
      return null;
    }
  }

  async deleteFile(fileName: string) {
    if (!(await this.ping()))
      throw new InternalServerErrorException(minioErrorEnums.NO_CONNECTION);

    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
