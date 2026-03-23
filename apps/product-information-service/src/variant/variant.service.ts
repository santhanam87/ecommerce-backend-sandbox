import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @Inject('VARIANT_REPOSITORY')
    private readonly variantRepository: typeof Variant,
  ) {}

  create(createVariantDto: CreateVariantDto): Promise<Variant> {
    return this.variantRepository.create({
      product_id: createVariantDto.product_id,
      sku: createVariantDto.sku,
      price: createVariantDto.price,
    });
  }

  findAll(): Promise<Variant[]> {
    return this.variantRepository.findAll();
  }

  async findOne(id: string): Promise<Variant> {
    const variant = await this.variantRepository.findByPk(id);

    if (!variant) {
      throw new NotFoundException(`Variant with id ${id} not found`);
    }

    return variant;
  }

  async update(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const variant = await this.findOne(id);

    await variant.update(updateVariantDto);
    return variant;
  }

  async remove(id: string): Promise<void> {
    const variant = await this.findOne(id);
    await variant.destroy();
  }
}
