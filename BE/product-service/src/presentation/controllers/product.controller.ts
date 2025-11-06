import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

import { CreateProductUseCase } from '../../application/use-cases/create-product.usecase';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { FilterProductDto } from '../../application/dto/filter-product.dto';
import { CreateProductDto } from '../../application/dto/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly createProduct: CreateProductUseCase) {}

  /**
   * Create a new product.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      default: {
        summary: 'Example product create payload',
        value: {
          title: 'Wireless Bluetooth Headphones',
          description: 'High-quality headphones with noise cancellation',
          price: 4599,
          stock: 120,
          category: 'electronics',
          brand: 'Sony',
          images: [
            'https://cdn.example.com/products/headphone1.png',
            'https://cdn.example.com/products/headphone2.png',
          ],
          specifications: {
            color: 'Black',
            batteryLife: '30 hours',
            connectivity: 'Bluetooth 5.2',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() dto: CreateProductDto) {
    try {
      const product = await this.createProduct.execute(dto);
      return { success: true, data: product };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create product',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get list of products with filtering
   */
  @Get()
  @ApiOperation({ summary: 'Get list of products (optional filters)' })
  @ApiQuery({
    name: 'category',
    required: false,
    example: 'electronics',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    example: 1000,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    example: 10000,
  })
  @ApiResponse({ status: 200, description: 'Products fetched successfully' })
  async list(@Query() filters: FilterProductDto) {
    try {
      return { success: true, filters };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch products',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a product by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiParam({
    name: 'id',
    example: '67891f2c4edb2cf15c271239',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          _id: '67891f2c4edb2cf15c271239',
          title: 'Wireless Bluetooth Headphones',
          price: 4599,
          stock: 120,
          category: 'electronics',
        },
      },
    },
  })
  async getOne(@Param('id') id: string) {
    try {
      return {
        success: true,
        id,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch product',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing product
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    example: '67891f2c4edb2cf15c271239',
  })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      default: {
        summary: 'Example product update payload',
        value: {
          title: 'Updated Wireless Bluetooth Headphones',
          price: 4999,
          stock: 90,
          category: 'electronics',
          brand: 'Sony',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    try {
      return { success: true, id, dto };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update product',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
