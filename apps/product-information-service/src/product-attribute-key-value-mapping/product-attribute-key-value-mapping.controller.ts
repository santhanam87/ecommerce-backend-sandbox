import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CheckPermission } from '../common/decorator/check-permission.decorator';
import {
  PERMISSION_KEYS,
  PERMISSION_SCOPE_BY_KEY,
} from '../common/constants/permission.constants';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { PermissionGuard } from '../auth/permission.guard';
import { CreateProductAttributeKeyValueMappingDto } from './dto/create-product-attribute-key-value-mapping.dto';
import { UpdateProductAttributeKeyValueMappingDto } from './dto/update-product-attribute-key-value-mapping.dto';
import { ProductAttributeKeyValueMapping } from './entities/product-attribute-key-value-mapping.entity';
import { ProductAttributeKeyValueMappingService } from './product-attribute-key-value-mapping.service';

@ApiTags('products/attribute-key-value-mappings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductAttributeKeyValueMappingController {
  constructor(
    private readonly productAttributeKeyValueMappingService: ProductAttributeKeyValueMappingService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING].CREATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING].READ,
  })
  @ApiOkResponse({ type: ProductAttributeKeyValueMapping, isArray: true })
  findAll(): Promise<ProductAttributeKeyValueMapping[]> {
    return this.productAttributeKeyValueMappingService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING].READ,
  })
  @ApiOkResponse({ type: ProductAttributeKeyValueMapping })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeKeyValueMapping> {
    return this.productAttributeKeyValueMappingService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING].UPDATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY_VALUE_MAPPING].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeKeyValueMappingService.remove(id);
  }
}
