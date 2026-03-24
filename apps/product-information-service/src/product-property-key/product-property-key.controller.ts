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
import { CreateProductPropertyKeyDto } from './dto/create-product-property-key.dto';
import { UpdateProductPropertyKeyDto } from './dto/update-product-property-key.dto';
import { ProductPropertyKey } from './entities/product-property-key.entity';
import { ProductPropertyKeyService } from './product-property-key.service';

@Controller('product-property-keys')
export class ProductPropertyKeyController {
  constructor(
    private readonly productPropertyKeyService: ProductPropertyKeyService,
  ) {}

  @Post()
  create(
    @Body() createProductPropertyKeyDto: CreateProductPropertyKeyDto,
  ): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.create(createProductPropertyKeyDto);
  }

  @Get()
  findAll(): Promise<ProductPropertyKey[]> {
    return this.productPropertyKeyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductPropertyKeyDto: UpdateProductPropertyKeyDto,
  ): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.update(
      id,
      updateProductPropertyKeyDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyKeyService.remove(id);
  }
}
