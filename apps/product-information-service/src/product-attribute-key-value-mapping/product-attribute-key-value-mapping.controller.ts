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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductAttributeKeyValueMappingDto } from './dto/create-product-attribute-key-value-mapping.dto';
import { UpdateProductAttributeKeyValueMappingDto } from './dto/update-product-attribute-key-value-mapping.dto';
import { ProductAttributeKeyValueMapping } from './entities/product-attribute-key-value-mapping.entity';
import { ProductAttributeKeyValueMappingService } from './product-attribute-key-value-mapping.service';

@ApiTags('products/attribute-key-value-mappings')
@Controller()
export class ProductAttributeKeyValueMappingController {
  constructor(
    private readonly productAttributeKeyValueMappingService: ProductAttributeKeyValueMappingService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductAttributeKeyValueMappingDto })
  @ApiCreatedResponse({ type: ProductAttributeKeyValueMapping })
  create(
    @Body()
    createProductAttributeKeyValueMappingDto: CreateProductAttributeKeyValueMappingDto,
  ): Promise<ProductAttributeKeyValueMapping> {
    return this.productAttributeKeyValueMappingService.create(
      createProductAttributeKeyValueMappingDto,
    );
  }

  @Get()
  @ApiOkResponse({ type: ProductAttributeKeyValueMapping, isArray: true })
  findAll(): Promise<ProductAttributeKeyValueMapping[]> {
    return this.productAttributeKeyValueMappingService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductAttributeKeyValueMapping })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeKeyValueMapping> {
    return this.productAttributeKeyValueMappingService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductAttributeKeyValueMappingDto })
  @ApiOkResponse({ type: ProductAttributeKeyValueMapping })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    updateProductAttributeKeyValueMappingDto: UpdateProductAttributeKeyValueMappingDto,
  ): Promise<ProductAttributeKeyValueMapping> {
    return this.productAttributeKeyValueMappingService.update(
      id,
      updateProductAttributeKeyValueMappingDto,
    );
  }

  @Delete(':id')
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeKeyValueMappingService.remove(id);
  }
}
