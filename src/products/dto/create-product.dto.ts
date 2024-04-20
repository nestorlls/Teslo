import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    nullable: false,
    minLength: 3,
    example: 'T-Shirt',
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 200,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product description',
    example: 'A red t-shirt',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product slug',
    example: 't_shirt',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    example: 'women',
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    example: ['t_shirt', 'red'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'Product images',
    example: ['https://image.com/image1.jpg', 'https://image.com/image2.jpg'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
