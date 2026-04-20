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
import { CreateProductPropertyKeyDto } from './dto/create-product-property-key.dto';
import { UpdateProductPropertyKeyDto } from './dto/update-product-property-key.dto';
import { ProductPropertyKey } from './entities/product-property-key.entity';
import { ProductPropertyKeyService } from './product-property-key.service';

@ApiTags('products/property-keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductPropertyKeyController {
  constructor(
    private readonly productPropertyKeyService: ProductPropertyKeyService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY].CREATE,
  })
  @ApiBody({ type: CreateProductPropertyKeyDto })
  @ApiCreatedResponse({ type: ProductPropertyKey })
  create(
    @Body() createProductPropertyKeyDto: CreateProductPropertyKeyDto,
  ): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.create(createProductPropertyKeyDto);
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY].READ,
  })
  @ApiOkResponse({ type: ProductPropertyKey, isArray: true })
  findAll(): Promise<ProductPropertyKey[]> {
    return this.productPropertyKeyService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY].READ,
  })
  @ApiOkResponse({ type: ProductPropertyKey })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductPropertyKey> {
    return this.productPropertyKeyService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY].UPDATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_KEY].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyKeyService.remove(id);
  }
}
