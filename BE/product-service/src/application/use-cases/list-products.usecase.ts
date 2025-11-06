import { Injectable, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../domain/interfaces/product-repository.interface';
import { FilterProductDto } from '../dto/filter-product.dto';
import { ProductDomainService } from '../../domain/services/product-domain.service';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryInterface,
    private readonly domainService: ProductDomainService,
    private readonly mapper: ProductMapper,
  ) {}

  async execute(filter: FilterProductDto) {
    // ✅ Validate using domain rules
    this.domainService.validateListFilters(filter);

    // ✅ Fetch list from repository (DB)
    const products = await this.productRepository.findAll(filter);

    // ✅ Convert domain entities → response models
    return products.map((product) => this.mapper.toResponse(product));
  }
}
