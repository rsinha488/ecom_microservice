import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../domain/interfaces/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductProducer } from '../../infrastructure/events/product.producer';

@Injectable()
export class CreateProductUseCase {
  private readonly logger = new Logger(CreateProductUseCase.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repo: ProductRepositoryInterface,

    private readonly producer: ProductProducer, // ✅ Kafka Producer
  ) {}

  /**
   * Create product and emit event to inventory service
   */
  async execute(dto: CreateProductDto) {
    try {
      // ✅ Create domain product entity
      const product = new Product(
        '',
        dto.name,
        dto.description,
        dto.price,
        dto.sku,
        dto.category,
        dto.stock,
        dto.images,
      );

      // ✅ Save to DB
      const created = await this.repo.create(product);

      // ✅ Emit Kafka event for inventory service
      await this.producer.emitProductCreatedEvent({
        sku: dto.sku,
        initialStock: dto.stock,
      });

      this.logger.log(`✅ Product created + event emitted. SKU=${dto.sku}`);

      return created;
    } catch (err) {
      this.logger.error('❌ Failed to create product', err);

      throw new HttpException(
        {
          success: false,
          message: 'Failed to create product',
          details: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
