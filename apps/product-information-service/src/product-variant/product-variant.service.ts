import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @Inject('PRODUCT_VARIANT_REPOSITORY')
    private readonly productVariantRepository: typeof ProductVariant,
  ) {}

  create(
    createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productVariantRepository.create({
      product_id: createProductVariantDto.product_id,
      sku: createProductVariantDto.sku,
      price: createProductVariantDto.price,
    });
  }

  findAll(): Promise<ProductVariant[]> {
    return this.productVariantRepository.findAll();
  }

  async findOne(id: string): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findByPk(id);

    if (!productVariant) {
      throw new NotFoundException(`Product variant with id ${id} not found`);
    }

    return productVariant;
  }

  async update(
    id: string,
    updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const productVariant = await this.findOne(id);

    await productVariant.update(updateProductVariantDto);
    return productVariant;
  }

  async remove(id: string): Promise<void> {
    const productVariant = await this.findOne(id);
    await productVariant.destroy();
  }
}
