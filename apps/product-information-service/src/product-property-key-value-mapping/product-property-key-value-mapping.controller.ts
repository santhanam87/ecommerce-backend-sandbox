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
import { CreateProductPropertyKeyValueMappingDto } from './dto/create-product-property-key-value-mapping.dto';
import { UpdateProductPropertyKeyValueMappingDto } from './dto/update-product-property-key-value-mapping.dto';
import { ProductPropertyKeyValueMapping } from './entities/product-property-key-value-mapping.entity';
import { ProductPropertyKeyValueMappingService } from './product-property-key-value-mapping.service';

@ApiTags('products/property-key-value-mappings')
@Controller()
export class ProductPropertyKeyValueMappingController {
  constructor(
    private readonly productPropertyKeyValueMappingService: ProductPropertyKeyValueMappingService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductPropertyKeyValueMappingDto })
  @ApiCreatedResponse({ type: ProductPropertyKeyValueMapping })
  create(
    @Body()
    createProductPropertyKeyValueMappingDto: CreateProductPropertyKeyValueMappingDto,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingService.create(
      createProductPropertyKeyValueMappingDto,
    );
  }

  @Get()
  @ApiOkResponse({ type: ProductPropertyKeyValueMapping, isArray: true })
  findAll(): Promise<ProductPropertyKeyValueMapping[]> {
    return this.productPropertyKeyValueMappingService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductPropertyKeyValueMapping })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductPropertyKeyValueMappingDto })
  @ApiOkResponse({ type: ProductPropertyKeyValueMapping })
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
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyKeyValueMappingService.remove(id);
  }
}
