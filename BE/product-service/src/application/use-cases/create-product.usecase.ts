import { Injectable, Inject } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../../domain/entities/product.entity';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../domain/interfaces/product-repository.interface';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private repo: ProductRepositoryInterface
  ) {}

  async execute(dto: CreateProductDto) {
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
    return this.repo.create(product);
  }
}
