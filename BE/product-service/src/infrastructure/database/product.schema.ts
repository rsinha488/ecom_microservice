import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema({ timestamps: true })
export class ProductModel {
  @Prop({ required: true, index: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, index: true })
  price!: number;

  @Prop({ required: true, unique: true })
  sku!: string;

  @Prop({ required: true, index: true })
  category!: string;

  @Prop({ required: true })
  stock!: number;

  @Prop([String])
  images!: string[];

  @Prop({ default: true })
  isActive!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);

// ✅ Compound search index (text + category)
ProductSchema.index({ name: 'text', description: 'text', category: 1 });

// ✅ For sharding & fast lookup
ProductSchema.index({ sku: 1 });
