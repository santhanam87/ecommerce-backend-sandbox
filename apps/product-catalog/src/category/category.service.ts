import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createCategory(name: string) {
    console.info('Creating category with name:', name);
    return this.prisma.category.create({
      data: {
        name,
      },
    });
  }
  async getCategories() {
    return this.prisma.category.findMany();
  }
  async getCategoryByName(name: string) {
    return this.prisma.category.findUnique({
      where: {
        name,
      },
    });
  }
  async deleteCategory(name: string) {
    const categoryProducts = await this.prisma.product.findMany({
      where: {
        name,
      },
    });
    if (categoryProducts.length > 0) {
      throw new Error('Cannot delete category with associated products');
    }
    return this.prisma.category.delete({
      where: {
        name,
      },
    });
  }
}
