import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class ProductProducer {
  private readonly producer: Producer;
  private readonly logger = new Logger(ProductProducer.name);

  constructor() {
    const kafka = new Kafka({
      clientId: 'product-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = kafka.producer();
    this.init();
  }

  async init() {
    try {
      await this.producer.connect();
      this.logger.log('✅ Kafka Producer connected');
    } catch (err) {
      this.logger.error('❌ Failed to connect Kafka Producer', err);
    }
  }

  /**
   * Emit `product.created` event to Kafka
   */
  async emitProductCreatedEvent(payload: any) {
    try {
      await this.producer.send({
        topic: 'product.created',
        messages: [{ value: JSON.stringify(payload) }],
      });

      this.logger.log(`📤 product.created emitted → ${JSON.stringify(payload)}`);
    } catch (err) {
      this.logger.error('❌ Failed to emit product.created event', err);
    }
  }
}
