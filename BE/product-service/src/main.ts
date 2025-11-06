import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  // Create Winston logger
  const winstonLogger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, { 
    logger: winstonLogger,
  });

  const configService = app.get(ConfigService);
  
  // Security middleware
  app.use(helmet());
  app.enableCors();

  // Best practice: global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Remove fields not in DTO
      forbidNonWhitelisted: true,
      transform: true,         // Auto-transform payload into DTO classes
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Product Service API')
    .setDescription('The Product service API documentation')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('product.port');
  await app.listen(port);
  
  const bootstrapLogger = new Logger('Bootstrap');
  bootstrapLogger.log(`🚀 Product service running on port ${port}`);
  bootstrapLogger.log(`📑 Swagger documentation available at http://localhost:${port}/api`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
