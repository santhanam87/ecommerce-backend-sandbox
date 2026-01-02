import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { ClientProxy } from '@nestjs/microservices';
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('STORE_SERVICE') private readonly messageClient: ClientProxy,
  ) {}

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post()
  async createProduct(@Body() payload: CreateProductDto) {
    const product = await this.productService.createProduct(payload);
    const { id: productId } = product;
    this.messageClient.emit(
      { event: 'product_created' },
      { productId, availableQty: 0 },
    );
    return product;
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
