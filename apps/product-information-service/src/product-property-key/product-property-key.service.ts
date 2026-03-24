import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductPropertyKeyDto } from './dto/create-product-property-key.dto';
import { UpdateProductPropertyKeyDto } from './dto/update-product-property-key.dto';
import { ProductPropertyKey } from './entities/product-property-key.entity';

@Injectable()
export class ProductPropertyKeyService {
  constructor(
    @Inject('PRODUCT_PROPERTY_KEY_REPOSITORY')
    private readonly productPropertyKeyRepository: typeof ProductPropertyKey,
  ) {}

  create(
    createProductPropertyKeyDto: CreateProductPropertyKeyDto,
  ): Promise<ProductPropertyKey> {
    return this.productPropertyKeyRepository.create({
      name: createProductPropertyKeyDto.name,
    });
  }

  findAll(): Promise<ProductPropertyKey[]> {
    return this.productPropertyKeyRepository.findAll();
  }

  async findOne(id: string): Promise<ProductPropertyKey> {
    const productPropertyKey =
      await this.productPropertyKeyRepository.findByPk(id);

    if (!productPropertyKey) {
      throw new NotFoundException(
        `Product property key with id ${id} not found`,
      );
    }

    return productPropertyKey;
  }

  async update(
    id: string,
    updateProductPropertyKeyDto: UpdateProductPropertyKeyDto,
  ): Promise<ProductPropertyKey> {
    const productPropertyKey = await this.findOne(id);

    await productPropertyKey.update(updateProductPropertyKeyDto);
    return productPropertyKey;
  }

  async remove(id: string): Promise<void> {
    const productPropertyKey = await this.findOne(id);
    await productPropertyKey.destroy();
  }
}
