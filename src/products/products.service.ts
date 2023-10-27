import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productProperties } = createProductDto;
      const product = this.productRepository.create({
        ...productProperties,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExeption(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: { images: true },
      });

      return products.map(({ images, ...rest }) => ({
        ...rest,
        images: images.map((image) => image.url),
      }));
    } catch (error) {
      this.handleDBExeption(error);
    }
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  private async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('LOWER(title) =:title or LOWER(slug) =:slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'productImages')
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...rest } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...rest });

    if (!product) throw new NotFoundException(`Product with ${id} not found`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExeption(error);
    }
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ${id} not found`);
    }
    return true;
  }

  //TODO: delete all products for SEEDING
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExeption(error);
    }
  }

  private handleDBExeption(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
