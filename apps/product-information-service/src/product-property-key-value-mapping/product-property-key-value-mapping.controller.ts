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
import { CreateProductPropertyKeyValueMappingDto } from './dto/create-product-property-key-value-mapping.dto';
import { UpdateProductPropertyKeyValueMappingDto } from './dto/update-product-property-key-value-mapping.dto';
import { ProductPropertyKeyValueMapping } from './entities/product-property-key-value-mapping.entity';
import { ProductPropertyKeyValueMappingService } from './product-property-key-value-mapping.service';

@Controller('product-property-key-value-mappings')
export class ProductPropertyKeyValueMappingController {
  constructor(
    private readonly productPropertyKeyValueMappingService: ProductPropertyKeyValueMappingService,
  ) {}

  @Post()
  create(
    @Body()
    createProductPropertyKeyValueMappingDto: CreateProductPropertyKeyValueMappingDto,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingService.create(
      createProductPropertyKeyValueMappingDto,
    );
  }

  @Get()
  findAll(): Promise<ProductPropertyKeyValueMapping[]> {
    return this.productPropertyKeyValueMappingService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateProductPropertyKeyValueMappingDto: UpdateProductPropertyKeyValueMappingDto,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingService.update(
      id,
      updateProductPropertyKeyValueMappingDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyKeyValueMappingService.remove(id);
  }
}
