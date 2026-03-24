import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductPropertyKeyValueMappingDto } from './dto/create-product-property-key-value-mapping.dto';
import { UpdateProductPropertyKeyValueMappingDto } from './dto/update-product-property-key-value-mapping.dto';
import { ProductPropertyKeyValueMapping } from './entities/product-property-key-value-mapping.entity';

@Injectable()
export class ProductPropertyKeyValueMappingService {
  constructor(
    @Inject('PRODUCT_PROPERTY_KEY_VALUE_MAPPING_REPOSITORY')
    private readonly productPropertyKeyValueMappingRepository: typeof ProductPropertyKeyValueMapping,
  ) {}

  create(
    createProductPropertyKeyValueMappingDto: CreateProductPropertyKeyValueMappingDto,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingRepository.create({
      variant_id: createProductPropertyKeyValueMappingDto.variant_id,
      property_key_id: createProductPropertyKeyValueMappingDto.property_key_id,
      property_value_id:
        createProductPropertyKeyValueMappingDto.property_value_id,
    });
  }

  findAll(): Promise<ProductPropertyKeyValueMapping[]> {
    return this.productPropertyKeyValueMappingRepository.findAll();
  }

  async findOne(id: string): Promise<ProductPropertyKeyValueMapping> {
    const productPropertyKeyValueMapping =
      await this.productPropertyKeyValueMappingRepository.findByPk(id);

    if (!productPropertyKeyValueMapping) {
      throw new NotFoundException(
        `Product property key value mapping with id ${id} not found`,
      );
    }

    return productPropertyKeyValueMapping;
  }

  async update(
    id: string,
    updateProductPropertyKeyValueMappingDto: UpdateProductPropertyKeyValueMappingDto,
  ): Promise<ProductPropertyKeyValueMapping> {
    const productPropertyKeyValueMapping = await this.findOne(id);

    await productPropertyKeyValueMapping.update(
      updateProductPropertyKeyValueMappingDto,
    );
    return productPropertyKeyValueMapping;
  }

  async remove(id: string): Promise<void> {
    const productPropertyKeyValueMapping = await this.findOne(id);
    await productPropertyKeyValueMapping.destroy();
  }
}
