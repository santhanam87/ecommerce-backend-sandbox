import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { type Request } from 'express';
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
    @Req() request: Request,
    @Body() payload: CreateProductDto,
  ) {
    const product = await this.productService.createProduct(payload);
    const { id: productId } = product;
    this.productMessageClient.emit(ProductEventPatterns.ProductCreated, {
      productId,
    });
    return product;
  }

  @EventPattern(ProductEventPatterns.ProductCreated)
  handleProductCreated(data) {
    console.info('Product created:', data);
  }

  // @MessagePattern({ event: 'product_inventory_created' })
  async updateProductStatus(data: { productId: string }) {
    await this.productService.updateProduct(data.productId, {
      status: 'ACTIVE',
    });
  }

  // @MessagePattern({ event: 'product_inventory_creation_failed' })
  async handleInventoryCreationFailure(data: { productId: string }) {
    console.info('inventory creation failed for product:', data.productId);
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
