import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

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

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async uploadFile(file: Express.Multer.File, fileName: string) {
    console.log(3);
    console.log(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    
    // const fileName = `${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
