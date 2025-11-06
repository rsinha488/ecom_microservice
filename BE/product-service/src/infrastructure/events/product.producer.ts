// src/infrastructure/events/product.producer.ts

import { Injectable, Logger } from '@nestjs/common';
// Example: Kafka, NATS, RabbitMQ (stub for now)

@Injectable()
export class ProductProducer {
  private readonly logger = new Logger(ProductProducer.name);

  async productUpdated(product: any): Promise<void> {
    // ✅ In real implementation: publish to Kafka/NATS
    this.logger.log(`EVENT: product.updated event emitted`, product);

    // Example placeholder
    return;
  }
}
