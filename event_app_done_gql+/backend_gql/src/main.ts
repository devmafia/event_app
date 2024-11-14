import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphqlUpload from 'graphql-upload/graphqlUploadExpress.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUpload({
    maxFileSize: 10000000,
    maxFiles: 10
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
