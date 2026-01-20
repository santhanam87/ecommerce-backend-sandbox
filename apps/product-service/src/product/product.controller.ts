import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { MessageExceptionFilter } from 'src/common/filter/rcp-exception.filter';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { ProductEventPatterns } from 'src/common/messaging/event.pattern';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCT_MESSAGE_CLIENT')
    private readonly productMessageClient: ClientProxy,
  ) {}

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @UseFilters(MessageExceptionFilter)
  @Post()
  async createProduct(
    @Body() { availableQuantity = 0, ...payload }: CreateProductDto,
  ) {
    const product = await this.productService.createProduct(payload);
    const { id: productId } = product;
    this.productMessageClient.emit(ProductEventPatterns.ProductCreated, {
      productId,
      availableQuantity,
    });
    return product;
  }

  @EventPattern(ProductEventPatterns.InventoryCreateSuccess)
  async updateProductStatus(data: { productId: string }) {
    console.info('Inventory created successfully for product:', data.productId);
    await this.productService.updateProduct(data.productId, {
      status: 'ACTIVE',
    });
  }

  @EventPattern(ProductEventPatterns.InventoryCreateFailed)
  async handleInventoryCreationFailure(data: { productId: string }) {
    console.error('Inventory creation failed for product:', data.productId);
    await this.productService.updateProduct(data.productId, {
      status: 'FAILED',
    });
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() payload: Partial<CreateProductDto>,
  ) {
    return this.productService.updateProduct(id, payload);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
