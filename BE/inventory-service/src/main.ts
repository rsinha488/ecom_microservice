import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  try {
    /**
     * --------------------------------------------------------------
     * ✅ Create Winston Logger (Console + File)
     * --------------------------------------------------------------
     */
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

    /**
     * --------------------------------------------------------------
     * ✅ Create NestJS Application with Winston Logger
     * --------------------------------------------------------------
     */
    const app = await NestFactory.create(AppModule, {
      logger: winstonLogger,
    });

    const configService = app.get(ConfigService);

    /**
     * --------------------------------------------------------------
     * ✅ Security Middleware (Helmet + CORS)
     * --------------------------------------------------------------
     */
    app.use(helmet());
    app.enableCors();

    /**
     * --------------------------------------------------------------
     * ✅ Global Validation (DTO validation)
     * --------------------------------------------------------------
     */
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    /**
     * --------------------------------------------------------------
     * ✅ Swagger Documentation Setup
     * --------------------------------------------------------------
     */
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Inventory Service API')
      .setDescription('API documentation for Inventory microservice')
      .setVersion('1.0')
      .addTag('inventory')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    /**
     * --------------------------------------------------------------
     * ✅ KAFKA Microservice Setup
     * Inventory service LISTENS to:
     *   • product_created  → create initial inventory entry
     *   • product_updated  → sync product title/price/etc
     *   • stock_adjust     → update stock quantity
     * --------------------------------------------------------------
     */
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'inventory-service',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
           retry: {
            initialRetryTime: 100,
            retries: 8
          }
        },
        consumer: {
          groupId: 'inventory-consumer-group',
        },
      },
    });

    await app.startAllMicroservices();
    winstonLogger.log('info', '✅ Kafka connected (Inventory service)');

    /**
     * --------------------------------------------------------------
     * ✅ Start HTTP Server
     * --------------------------------------------------------------
     */
    const port = configService.get<number>('inventory.port') || 3003;
    await app.listen(port);

    const bootstrapLogger = new Logger('Bootstrap');
    bootstrapLogger.log(`🚀 Inventory service running on port ${port}`);
    bootstrapLogger.log(
      `📘 Swagger available at http://localhost:${port}/api`,
    );
    bootstrapLogger.log(`📡 Kafka Consumers ready — Listening to product events`);

    /**
     * --------------------------------------------------------------
     * ✅ Graceful Shutdown
     * (Prevents Kafka disconnect errors during container stop)
     * --------------------------------------------------------------
     */
    process.on('SIGINT', async () => {
      winstonLogger.warn('🛑 SIGINT received. Shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      winstonLogger.warn('🛑 SIGTERM received. Shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    /**
     * --------------------------------------------------------------
     * ❌ Fatal Bootstrapping Error
     * --------------------------------------------------------------
     */
    console.error('❌ Fatal Inventory Service Startup Error:', error);
    process.exit(1);
  }
}

/**
 * --------------------------------------------------------------
 * ✅ Catch Unhandled Exceptions Globally
 * --------------------------------------------------------------
 */
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

bootstrap();
