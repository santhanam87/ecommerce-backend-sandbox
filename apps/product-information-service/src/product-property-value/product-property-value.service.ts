import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductPropertyValueDto } from './dto/create-product-property-value.dto';
import { UpdateProductPropertyValueDto } from './dto/update-product-property-value.dto';
import { ProductPropertyValue } from './entities/product-property-value.entity';

@Injectable()
export class ProductPropertyValueService {
  constructor(
    @Inject('PRODUCT_PROPERTY_VALUE_REPOSITORY')
    private readonly productPropertyValueRepository: typeof ProductPropertyValue,
  ) {}

  create(
    createProductPropertyValueDto: CreateProductPropertyValueDto,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueRepository.create({
      property_id: createProductPropertyValueDto.property_id,
      value: createProductPropertyValueDto.value,
    });
  }

  findAll(): Promise<ProductPropertyValue[]> {
    return this.productPropertyValueRepository.findAll();
  }

  async findOne(id: string): Promise<ProductPropertyValue> {
    const productPropertyValue =
      await this.productPropertyValueRepository.findByPk(id);

    if (!productPropertyValue) {
      throw new NotFoundException(
        `Product property value with id ${id} not found`,
      );
    }

    return productPropertyValue;
  }

  async update(
    id: string,
    updateProductPropertyValueDto: UpdateProductPropertyValueDto,
  ): Promise<ProductPropertyValue> {
    const productPropertyValue = await this.findOne(id);

    await productPropertyValue.update(updateProductPropertyValueDto);
    return productPropertyValue;
  }

  async remove(id: string): Promise<void> {
    const productPropertyValue = await this.findOne(id);
    await productPropertyValue.destroy();
  }
}
