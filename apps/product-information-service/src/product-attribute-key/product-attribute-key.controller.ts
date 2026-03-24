import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductAttributeKeyDto } from './dto/create-product-attribute-key.dto';
import { UpdateProductAttributeKeyDto } from './dto/update-product-attribute-key.dto';
import { ProductAttributeKey } from './entities/product-attribute-key.entity';
import { ProductAttributeKeyService } from './product-attribute-key.service';

@Controller('product-attribute-keys')
export class ProductAttributeKeyController {
  constructor(
    private readonly productAttributeKeyService: ProductAttributeKeyService,
  ) {}

  @Post()
  create(
    @Body() createProductAttributeKeyDto: CreateProductAttributeKeyDto,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.create(createProductAttributeKeyDto);
  }

  @Get()
  findAll(): Promise<ProductAttributeKey[]> {
    return this.productAttributeKeyService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductAttributeKeyDto: UpdateProductAttributeKeyDto,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.update(
      id,
      updateProductAttributeKeyDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeKeyService.remove(id);
  }
}
