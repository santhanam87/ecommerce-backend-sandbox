import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryDto } from './dto/inventory-create.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createInventoryItem(data: CreateInventoryDto) {
    return await this.prisma.inventory.create({
      data: { ...data },
    });
  }
  async getInventoryByProductId(productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });
    return inventory;
  }
  async adjustStock(productId: string, quantity: number) {
    const inventory = await this.prisma.inventory.updateMany({
      where: {
        productId,
      },
      data: {
        availableQuantity: {
          decrement: quantity,
        },
        reservedQuantity: {
          increment: quantity,
        },
      },
    });
    if (inventory.count === 0) {
      return null;
    }
    return this.getInventoryByProductId(productId);
  }
}
