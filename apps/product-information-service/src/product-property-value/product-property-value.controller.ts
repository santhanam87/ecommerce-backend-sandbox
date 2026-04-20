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
import { CreateProductPropertyValueDto } from './dto/create-product-property-value.dto';
import { UpdateProductPropertyValueDto } from './dto/update-product-property-value.dto';
import { ProductPropertyValue } from './entities/product-property-value.entity';
import { ProductPropertyValueService } from './product-property-value.service';

@ApiTags('products/property-values')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductPropertyValueController {
  constructor(
    private readonly productPropertyValueService: ProductPropertyValueService,
  ) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE].CREATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE].READ,
  })
  @ApiOkResponse({ type: ProductPropertyValue, isArray: true })
  findAll(): Promise<ProductPropertyValue[]> {
    return this.productPropertyValueService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE].READ,
  })
  @ApiOkResponse({ type: ProductPropertyValue })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductPropertyValue> {
    return this.productPropertyValueService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE].UPDATE,
  })
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
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT_PROPERTY_VALUE].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productPropertyValueService.remove(id);
  }
}
