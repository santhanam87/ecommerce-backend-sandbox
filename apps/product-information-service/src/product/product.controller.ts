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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT].CREATE,
  })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ type: Product })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT].READ,
  })
  @ApiOkResponse({ type: Product, isArray: true })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT].READ,
  })
  @ApiOkResponse({ type: Product })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT].UPDATE,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ type: Product })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @CheckPermission({
    key: PERMISSION_KEYS.PRODUCT,
    scope: PERMISSION_SCOPE_BY_KEY[PERMISSION_KEYS.PRODUCT].DELETE,
  })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
