import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.INVENTORY_PORT ? +process.env.INVENTORY_PORT : 4010;
  await app.listen(port);
  Logger.log(`Inventory service listening on ${port}`, 'Bootstrap');
}
bootstrap();
