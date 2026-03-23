import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: typeof Product,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
    });
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    await product.update(updateProductDto);
    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
