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
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantService } from './product-variant.service';

@ApiTags('product/variants')
@Controller()
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @ApiBody({ type: CreateProductVariantDto })
  @ApiCreatedResponse({ type: ProductVariant })
  create(
    @Body() createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productVariantService.create(createProductVariantDto);
  }

  @Get()
  @ApiOkResponse({ type: ProductVariant, isArray: true })
  findAll(): Promise<ProductVariant[]> {
    return this.productVariantService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductVariant })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductVariant> {
    return this.productVariantService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductVariantDto })
  @ApiOkResponse({ type: ProductVariant })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productVariantService.remove(id);
  }
}
