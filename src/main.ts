import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import configuration from 'config/configuration';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter.interceptor';

async function bootstrap() {
  const applicationConfigs = configuration();

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());
  const corsOptions = {
    origin: applicationConfigs.client.uri, // Replace with the URL of your React app
    methods: applicationConfigs.client.methods,
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle(applicationConfigs.appName)
    .setVersion('1.0')
    .addServer(`http://localhost:${applicationConfigs.port}`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const PORT = applicationConfigs.port;
  await app.listen(PORT, () => {
    const { minio, redis, database } = applicationConfigs;
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
