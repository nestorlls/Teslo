import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'f3b9f6c6-9b6b-4a6b-9b6b-9b6b9b6b9b6b',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({ example: 20, description: 'Product Price', default: 0 })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    description: 'Product Description',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  descrition: string;

  @ApiProperty({
    example: 't_shirt',
    description: 'Product Slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({ example: 10, description: 'Product Stock', default: 0 })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Product Sizes',
    default: [],
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({ example: 'women', description: 'Product Gender', default: '' })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['t_shirt', 'pants'],
    description: 'Product Tags',
    default: [],
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    example: ['https://image.com/image1.jpg', 'https://image.com/image2.jpg'],
    default: [],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
