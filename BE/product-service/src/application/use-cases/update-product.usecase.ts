// src/application/use-cases/update-product.usecase.ts

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryInterface,
} from '../../domain/interfaces/product-repository.interface';

import { ProductDomainService } from '../../domain/services/product-domain.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';
import { ProductProducer } from '../../infrastructure/events/product.producer';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryInterface,

    private readonly domainService: ProductDomainService,
    private readonly mapper: ProductMapper,
    private readonly producer: ProductProducer,
  ) {}

  async execute(id: string, dto: UpdateProductDto) {
    // ✅ Step 1 — Ensure product exists (Domain rule)
    const existing = await this.repository.findById(id);
    await this.domainService.ensureProductExists(existing, id);

    // ✅ Step 2 — Update product (Repository)
    const updated = await this.repository.update(id, dto);

    if (!updated) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // ✅ Step 3 — Convert DB document → Domain entity
    const productEntity = this.mapper.toEntity(updated);

    if (!productEntity) {
      throw new Error('Mapper failed to convert updated product');
    }

    // ✅ Step 4 — Domain validates the updated product
    this.domainService.validateProduct(productEntity);

    // ✅ Step 5 — Emit async event (Kafka/NATS/Redis Streams)
    await this.producer.productUpdated(productEntity);

    // ✅ Step 6 — Convert Domain → API Response
    return this.mapper.toResponse(productEntity);
  }
}
