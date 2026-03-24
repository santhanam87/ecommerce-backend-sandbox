import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductAttributeKeyDto } from './dto/create-product-attribute-key.dto';
import { UpdateProductAttributeKeyDto } from './dto/update-product-attribute-key.dto';
import { ProductAttributeKey } from './entities/product-attribute-key.entity';

@Injectable()
export class ProductAttributeKeyService {
  constructor(
    @Inject('PRODUCT_ATTRIBUTE_KEY_REPOSITORY')
    private readonly productAttributeKeyRepository: typeof ProductAttributeKey,
  ) {}

  create(
    createProductAttributeKeyDto: CreateProductAttributeKeyDto,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyRepository.create({
      name: createProductAttributeKeyDto.name,
      is_variant: createProductAttributeKeyDto.is_variant,
    });
  }

  findAll(): Promise<ProductAttributeKey[]> {
    return this.productAttributeKeyRepository.findAll();
  }

  async findOne(id: string): Promise<ProductAttributeKey> {
    const productAttributeKey =
      await this.productAttributeKeyRepository.findByPk(id);

    if (!productAttributeKey) {
      throw new NotFoundException(
        `Product attribute key with id ${id} not found`,
      );
    }

    return productAttributeKey;
  }

  async update(
    id: string,
    updateProductAttributeKeyDto: UpdateProductAttributeKeyDto,
  ): Promise<ProductAttributeKey> {
    const productAttributeKey = await this.findOne(id);

    await productAttributeKey.update(updateProductAttributeKeyDto);
    return productAttributeKey;
  }

  async remove(id: string): Promise<void> {
    const productAttributeKey = await this.findOne(id);
    await productAttributeKey.destroy();
  }
}
