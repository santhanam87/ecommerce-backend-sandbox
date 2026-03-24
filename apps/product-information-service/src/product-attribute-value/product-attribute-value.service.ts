import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductAttributeValueDto } from './dto/create-product-attribute-value.dto';
import { UpdateProductAttributeValueDto } from './dto/update-product-attribute-value.dto';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';

@Injectable()
export class ProductAttributeValueService {
  constructor(
    @Inject('PRODUCT_ATTRIBUTE_VALUE_REPOSITORY')
    private readonly productAttributeValueRepository: typeof ProductAttributeValue,
  ) {}

  create(
    createProductAttributeValueDto: CreateProductAttributeValueDto,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueRepository.create({
      attribute_id: createProductAttributeValueDto.attribute_id,
      value: createProductAttributeValueDto.value,
    });
  }

  findAll(): Promise<ProductAttributeValue[]> {
    return this.productAttributeValueRepository.findAll();
  }

  async findOne(id: string): Promise<ProductAttributeValue> {
    const productAttributeValue =
      await this.productAttributeValueRepository.findByPk(id);

    if (!productAttributeValue) {
      throw new NotFoundException(
        `Product attribute value with id ${id} not found`,
      );
    }

    return productAttributeValue;
  }

  async update(
    id: string,
    updateProductAttributeValueDto: UpdateProductAttributeValueDto,
  ): Promise<ProductAttributeValue> {
    const productAttributeValue = await this.findOne(id);

    await productAttributeValue.update(updateProductAttributeValueDto);
    return productAttributeValue;
  }

  async remove(id: string): Promise<void> {
    const productAttributeValue = await this.findOne(id);
    await productAttributeValue.destroy();
  }
}