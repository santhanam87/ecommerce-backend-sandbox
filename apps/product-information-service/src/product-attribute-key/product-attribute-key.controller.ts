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
import { CreateProductAttributeKeyDto } from './dto/create-product-attribute-key.dto';
import { UpdateProductAttributeKeyDto } from './dto/update-product-attribute-key.dto';
import { ProductAttributeKey } from './entities/product-attribute-key.entity';
import { ProductAttributeKeyService } from './product-attribute-key.service';

@ApiTags('products/attribute-keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductAttributeKeyController {
  constructor(
    private readonly productAttributeKeyService: ProductAttributeKeyService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY,
    scope:
      PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY].CREATE,
  })
  @ApiBody({ type: CreateProductAttributeKeyDto })
  @ApiCreatedResponse({ type: ProductAttributeKey })
  create(
    @Body() createProductAttributeKeyDto: CreateProductAttributeKeyDto,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.create(createProductAttributeKeyDto);
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY].READ,
  })
  @ApiOkResponse({ type: ProductAttributeKey, isArray: true })
  findAll(): Promise<ProductAttributeKey[]> {
    return this.productAttributeKeyService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY].READ,
  })
  @ApiOkResponse({ type: ProductAttributeKey })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeKey> {
    return this.productAttributeKeyService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY,
    scope:
      PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY].UPDATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY,
    scope:
      PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_KEY].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeKeyService.remove(id);
  }
}
