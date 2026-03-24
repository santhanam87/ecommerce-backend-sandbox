import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductAttributeKeyValueMappingDto } from './dto/create-product-attribute-key-value-mapping.dto';
import { UpdateProductAttributeKeyValueMappingDto } from './dto/update-product-attribute-key-value-mapping.dto';
import { ProductAttributeKeyValueMapping } from './entities/product-attribute-key-value-mapping.entity';

@Injectable()
export class ProductAttributeKeyValueMappingService {
  constructor(
    @Inject('PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING_REPOSITORY')
    private readonly productAttributeKeyValueMappingRepository: typeof ProductAttributeKeyValueMapping,
  ) {}

  create(
    createProductAttributeKeyValueMappingDto: CreateProductAttributeKeyValueMappingDto,
  ): Promise<ProductAttributeKeyValueMapping> {
    return this.productAttributeKeyValueMappingRepository.create({
      variant_id: createProductAttributeKeyValueMappingDto.variant_id,
      attribute_key_id:
        createProductAttributeKeyValueMappingDto.attribute_key_id,
      attribute_value_id:
        createProductAttributeKeyValueMappingDto.attribute_value_id,
    });
  }

  findAll(): Promise<ProductAttributeKeyValueMapping[]> {
    return this.productAttributeKeyValueMappingRepository.findAll();
  }

  async findOne(id: string): Promise<ProductAttributeKeyValueMapping> {
    const productAttributeKeyValueMapping =
      await this.productAttributeKeyValueMappingRepository.findByPk(id);

    if (!productAttributeKeyValueMapping) {
      throw new NotFoundException(
        `Product attribute key value mapping with id ${id} not found`,
      );
    }

    return productAttributeKeyValueMapping;
  }

  async update(
    id: string,
    updateProductAttributeKeyValueMappingDto: UpdateProductAttributeKeyValueMappingDto,
  ): Promise<ProductAttributeKeyValueMapping> {
    const productAttributeKeyValueMapping = await this.findOne(id);

    await productAttributeKeyValueMapping.update(
      updateProductAttributeKeyValueMappingDto,
    );
    return productAttributeKeyValueMapping;
  }

  async remove(id: string): Promise<void> {
    const productAttributeKeyValueMapping = await this.findOne(id);
    await productAttributeKeyValueMapping.destroy();
  }
}
