import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseFormatterInterceptor } from './common/interceptors/response-formatter.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  const PORT = process.env.PORT;
  await app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
}
bootstrap();
