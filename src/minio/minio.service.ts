import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
  private bucket: string;
  private client: any;
  constructor(
    private readonly minio: MinioService,
    private configService: ConfigService,
  ) {
    this.bucket = configService.get('minio.bucket');
    this.client = minio.client;
  }
}
