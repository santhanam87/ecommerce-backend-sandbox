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
import { CreateProductPropertyValueDto } from './dto/create-product-property-value.dto';
import { UpdateProductPropertyValueDto } from './dto/update-product-property-value.dto';
import { ProductPropertyValue } from './entities/product-property-value.entity';
import { ProductPropertyValueService } from './product-property-value.service';

@ApiTags('products/property-values')
@Controller()
export class ProductPropertyValueController {
  constructor(
    private readonly productPropertyValueService: ProductPropertyValueService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductPropertyValueDto })
  @ApiCreatedResponse({ type: ProductPropertyValue })
  create(
    @Body() createProductPropertyValueDto: CreateProductPropertyValueDto,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueService.create(
      createProductPropertyValueDto,
    );
  }

  @Get()
  @ApiOkResponse({ type: ProductPropertyValue, isArray: true })
  findAll(): Promise<ProductPropertyValue[]> {
    return this.productPropertyValueService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductPropertyValue })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductPropertyValueDto })
  @ApiOkResponse({ type: ProductPropertyValue })
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
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyValueService.remove(id);
  }
}
