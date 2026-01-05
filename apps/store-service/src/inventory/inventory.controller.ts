import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory-create.dto';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('STORE_SERVICE') private readonly messageClient: ClientProxy,
  ) {}

  @MessagePattern({ event: 'product_created' })
  async createInventory(
    createInventoryDto: CreateInventoryDto & { token: string },
  ) {
    try {
      const inventroy =
        await this.inventoryService.createInventoryItem(createInventoryDto);
      this.messageClient.emit(
        { event: 'product_inventory_created' },
        { productId: createInventoryDto.productId },
      );
      return inventroy;
    } catch (err) {
      this.messageClient.emit(
        { event: 'product_inventory_creation_failed' },
        { productId: createInventoryDto.productId },
      );
      console.error('Error creating inventory item:', err);
    }
  }
  @Get(':productId')
  getInventory(@Param('productId') productId: string) {
    this.messageClient.emit({ event: 'inventory_failed' }, { productId });
    console.info('emit');
    return this.inventoryService.getInventoryByProductId(productId);
  }

  @Post('adjust-stock')
  adjustStock(@Body() body: { productId: string; quantity: number }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity);
  }

  @MessagePattern({ event: 'order_created' })
  public processPayment(order: any) {
    console.info('reserve stock for order:', order.id);
    this.messageClient.emit({ event: 'stock_reserved' }, order);
  }
}
