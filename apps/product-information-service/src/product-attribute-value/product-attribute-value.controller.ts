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
import { CreateProductAttributeValueDto } from './dto/create-product-attribute-value.dto';
import { UpdateProductAttributeValueDto } from './dto/update-product-attribute-value.dto';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { ProductAttributeValueService } from './product-attribute-value.service';

@Controller('product-attribute-values')
export class ProductAttributeValueController {
  constructor(
    private readonly productAttributeValueService: ProductAttributeValueService,
  ) {}

  @Post()
  create(
    @Body() createProductAttributeValueDto: CreateProductAttributeValueDto,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueService.create(
      createProductAttributeValueDto,
    );
  }

  @Get()
  findAll(): Promise<ProductAttributeValue[]> {
    return this.productAttributeValueService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductAttributeValueDto: UpdateProductAttributeValueDto,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueService.update(
      id,
      updateProductAttributeValueDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeValueService.remove(id);
  }
}