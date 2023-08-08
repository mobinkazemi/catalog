import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import configuration from 'config/configuration';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter.interceptor';

async function bootstrap() {
  const configs = configuration();
  console.log(configs);

  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle(configs.appName)
    .setVersion('1.0')
    .addServer(`http://localhost:${configs.port}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = configs.port;
  await app.listen(PORT, () => {
    const { minio, redis, database } = configs;
    console.log(`✅ Environment is: ${process.env.NODE_ENV}`);
    console.log(`✅ App is running on port ${PORT}`);
    console.log(
      `👀 Expecting Minio on ${minio.host}:${minio.port}/${minio.bucket}`,
    );
    console.log(
      `👀 Expecting Redis on ${redis.host}:${redis.port}/${redis.name}`,
    );
    console.log(`👀 Expecting Mongo on ${database.uri.split('//')[1]}`);
  });
}
bootstrap();
