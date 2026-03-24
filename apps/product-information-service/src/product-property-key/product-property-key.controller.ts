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
import { CreateProductPropertyKeyDto } from './dto/create-product-property-key.dto';
import { UpdateProductPropertyKeyDto } from './dto/update-product-property-key.dto';
import { ProductPropertyKey } from './entities/product-property-key.entity';
import { ProductPropertyKeyService } from './product-property-key.service';

@ApiTags('product-property-keys')
@Controller('product-property-keys')
export class ProductPropertyKeyController {
  constructor(
    private readonly productPropertyKeyService: ProductPropertyKeyService,
  ) {}

  @Post()
  @ApiBody({ type: CreateProductPropertyKeyDto })
  @ApiCreatedResponse({ type: ProductPropertyKey })
  create(
    @Body() createProductPropertyKeyDto: CreateProductPropertyKeyDto,
  ): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.create(createProductPropertyKeyDto);
  }

  @Get()
  @ApiOkResponse({ type: ProductPropertyKey, isArray: true })
  findAll(): Promise<ProductPropertyKey[]> {
    return this.productPropertyKeyService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductPropertyKey })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductPropertyKeyDto })
  @ApiOkResponse({ type: ProductPropertyKey })
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
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyKeyService.remove(id);
  }
}
