import { IsString, IsNumber, IsArray, MinLength, IsNotEmpty, IsPositive, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  stock!: number;

  @IsArray()
  images!: Base64URLString[];

}
