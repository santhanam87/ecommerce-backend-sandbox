import { Injectable } from '@nestjs/common';
import { Inventory } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryDto } from './dto/inventory-create.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createInventoryItem(data: CreateInventoryDto): Promise<Inventory> {
    const inventory = await this.prisma.inventory.create({ data });
    return inventory;
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
        availableQty: {
          decrement: quantity,
        },
        reservedQty: {
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
