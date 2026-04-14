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
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantService } from './product-variant.service';

@ApiTags('products/variants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_VARIANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_VARIANT].CREATE,
  })
  @ApiBody({ type: CreateProductVariantDto })
  @ApiCreatedResponse({ type: ProductVariant })
  create(
    @Body() createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productVariantService.create(createProductVariantDto);
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_VARIANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_VARIANT].READ,
  })
  @ApiOkResponse({ type: ProductVariant, isArray: true })
  findAll(): Promise<ProductVariant[]> {
    return this.productVariantService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_VARIANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_VARIANT].READ,
  })
  @ApiOkResponse({ type: ProductVariant })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductVariant> {
    return this.productVariantService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_VARIANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_VARIANT].UPDATE,
  })
  @ApiBody({ type: UpdateProductVariantDto })
  @ApiOkResponse({ type: ProductVariant })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_VARIANT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_VARIANT].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productVariantService.remove(id);
  }
}
