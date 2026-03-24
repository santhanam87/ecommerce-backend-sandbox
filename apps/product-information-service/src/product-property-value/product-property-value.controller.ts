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
import { CreateProductPropertyValueDto } from './dto/create-product-property-value.dto';
import { UpdateProductPropertyValueDto } from './dto/update-product-property-value.dto';
import { ProductPropertyValue } from './entities/product-property-value.entity';
import { ProductPropertyValueService } from './product-property-value.service';

@Controller('product-property-values')
export class ProductPropertyValueController {
  constructor(
    private readonly productPropertyValueService: ProductPropertyValueService,
  ) {}

  @Post()
  create(
    @Body() createProductPropertyValueDto: CreateProductPropertyValueDto,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueService.create(
      createProductPropertyValueDto,
    );
  }

  @Get()
  findAll(): Promise<ProductPropertyValue[]> {
    return this.productPropertyValueService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductPropertyValueDto: UpdateProductPropertyValueDto,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueService.update(
      id,
      updateProductPropertyValueDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyValueService.remove(id);
  }
}
