import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '../../generated/prisma/client';
import { CreateProductDto } from './dto/create-product-dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllProducts(): Promise<Product[]> {
    const products: Product[] = await this.prisma.product.findMany();
    return products;
  }
  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product;
  }
  async createProduct(payload: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: payload,
      });
      console.info(product);
      return product;
    } catch (e) {
      console.info(e);
    }
  }
  async deleteProduct(id: string): Promise<Product> {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    return product;
  }
  async updateProduct(
    id: string,
    payload: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: payload,
    });
    return product;
  }
}
