// src/infrastructure/repositories/product.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRepositoryInterface } from '../../domain/interfaces/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductModel } from '../database/product.schema';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  async create(product: Product): Promise<Product> {
    const created = await this.productModel.create(product);
    return ProductMapper.toDomain(created.toObject())!;
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .lean();

    return ProductMapper.toDomain(updated);
  }

  async findById(id: string): Promise<Product | null> {
    const found = await this.productModel.findById(id).lean();
    return ProductMapper.toDomain(found);
  }

  async findAll(filters: any): Promise<Product[]> {
    const rows = await this.productModel.find(filters).lean();
    return rows
      .map((r) => ProductMapper.toDomain(r))
      .filter((p) => p !== null) as Product[];
  }
}
