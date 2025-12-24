import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory-create.dto';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  createInventory(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.createInventoryItem(createInventoryDto);
  }

  @Get(':productId')
  getInventory(@Param('productId') productId: string) {
    return this.inventoryService.getInventoryByProductId(productId);
  }

  @Post('adjust-stock')
  adjustStock(@Body() body: { productId: string; quantity: number }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity);
  }
}
