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
import { CreateProductAttributeValueDto } from './dto/create-product-attribute-value.dto';
import { UpdateProductAttributeValueDto } from './dto/update-product-attribute-value.dto';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { ProductAttributeValueService } from './product-attribute-value.service';

@ApiTags('products/attribute-values')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductAttributeValueController {
  constructor(
    private readonly productAttributeValueService: ProductAttributeValueService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE].CREATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE].READ,
  })
  @ApiOkResponse({ type: ProductAttributeValue, isArray: true })
  findAll(): Promise<ProductAttributeValue[]> {
    return this.productAttributeValueService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE].READ,
  })
  @ApiOkResponse({ type: ProductAttributeValue })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductAttributeValue> {
    return this.productAttributeValueService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE].UPDATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_ATTRIBUTE_VALUE].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAttributeValueService.remove(id);
  }
}
