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
import { CreateProductPropertyKeyValueMappingDto } from './dto/create-product-property-key-value-mapping.dto';
import { UpdateProductPropertyKeyValueMappingDto } from './dto/update-product-property-key-value-mapping.dto';
import { ProductPropertyKeyValueMapping } from './entities/product-property-key-value-mapping.entity';
import { ProductPropertyKeyValueMappingService } from './product-property-key-value-mapping.service';

@ApiTags('products/property-key-value-mappings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductPropertyKeyValueMappingController {
  constructor(
    private readonly productPropertyKeyValueMappingService: ProductPropertyKeyValueMappingService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING].CREATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING].READ,
  })
  @ApiOkResponse({ type: ProductPropertyKeyValueMapping, isArray: true })
  findAll(): Promise<ProductPropertyKeyValueMapping[]> {
    return this.productPropertyKeyValueMappingService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING].READ,
  })
  @ApiOkResponse({ type: ProductPropertyKeyValueMapping })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductPropertyKeyValueMapping> {
    return this.productPropertyKeyValueMappingService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING].UPDATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY_VALUE_MAPPING].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyKeyValueMappingService.remove(id);
  }
}
