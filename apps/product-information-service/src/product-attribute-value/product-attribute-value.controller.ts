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
import { CreateProductAttributeValueDto } from './dto/create-product-attribute-value.dto';
import { UpdateProductAttributeValueDto } from './dto/update-product-attribute-value.dto';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { ProductAttributeValueService } from './product-attribute-value.service';

@ApiTags('product/attribute-values')
@Controller()
export class ProductAttributeValueController {
  constructor(
    private readonly productAttributeValueService: ProductAttributeValueService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductAttributeValueDto })
  @ApiCreatedResponse({ type: ProductAttributeValue })
  create(
    @Body() createProductAttributeValueDto: CreateProductAttributeValueDto,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueService.create(
      createProductAttributeValueDto,
    );
  }

  @Get()
  @ApiOkResponse({ type: ProductAttributeValue, isArray: true })
  findAll(): Promise<ProductAttributeValue[]> {
    return this.productAttributeValueService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductAttributeValue })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductAttributeValueDto })
  @ApiOkResponse({ type: ProductAttributeValue })
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
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeValueService.remove(id);
  }
}
