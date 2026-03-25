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
import { CreateProductAttributeKeyDto } from './dto/create-product-attribute-key.dto';
import { UpdateProductAttributeKeyDto } from './dto/update-product-attribute-key.dto';
import { ProductAttributeKey } from './entities/product-attribute-key.entity';
import { ProductAttributeKeyService } from './product-attribute-key.service';

@ApiTags('product/attribute-keys')
@Controller()
export class ProductAttributeKeyController {
  constructor(
    private readonly productAttributeKeyService: ProductAttributeKeyService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductAttributeKeyDto })
  @ApiCreatedResponse({ type: ProductAttributeKey })
  create(
    @Body() createProductAttributeKeyDto: CreateProductAttributeKeyDto,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.create(createProductAttributeKeyDto);
  }

  @Get()
  @ApiOkResponse({ type: ProductAttributeKey, isArray: true })
  findAll(): Promise<ProductAttributeKey[]> {
    return this.productAttributeKeyService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductAttributeKey })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductAttributeKeyDto })
  @ApiOkResponse({ type: ProductAttributeKey })
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
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeKeyService.remove(id);
  }
}
