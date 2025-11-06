import { Injectable, Logger } from '@nestjs/common';
import { CreateItemUseCase } from '../../application/use-cases/create-item.usecase';
import { Kafka, Consumer } from 'kafkajs';

/**
 * InventoryEventHandler
 * ----------------------
 * Subscribes to product_created events from Kafka
 * and automatically creates an inventory record.
 */
@Injectable()
export class InventoryEventHandler {
  private readonly logger = new Logger(InventoryEventHandler.name);
  private readonly consumer: Consumer;

  constructor(
    private readonly createInventory: CreateItemUseCase,
  ) {
    const kafka = new Kafka({
      clientId: 'inventory-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'inventory-group' });

    this.initialize();
  }

  /**
   * Bootstrap Kafka consumer.
   */
  private async initialize() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: 'product_created', fromBeginning: false });

      this.logger.log('✅ Kafka Consumer connected (Inventory Service)');

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;

          const event = JSON.parse(message.value.toString());

          this.logger.log(
            `📥 Received product_created event for SKU=${event.sku}`,
          );

          await this.handleProductCreated(event);
        },
      });
    } catch (error) {
      this.logger.error('❌ Failed to initialize Kafka consumer', error);
    }
  }

  /**
   * Handles product creation logic.
   */
  private async handleProductCreated(event: any) {
    try {
      await this.createInventory.execute({
        sku: event.sku,
        stock: event.stock,
        location: 'default',
      });

      this.logger.log(
        `✅ Inventory created for SKU=${event.sku} (initial stock: ${event.stock})`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to create inventory for SKU=${event.sku}`,
        error.message,
      );
    }
  }
}
