import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PurchaseDto } from './dto/purchase.dto';
import { RestockDto } from './dto/restock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('sweets')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('purchase-multiple')
  purchaseMultiple(@Body() items: { id: number; quantity: number }[]) {
    return this.inventoryService.purchaseMultiple(items);
  }

  @Post(':id/purchase')
  purchase(@Param('id') id: string, @Body() purchaseDto: PurchaseDto) {
    return this.inventoryService.purchase(+id, purchaseDto);
  }

  @Post(':id/restock')
  @UseGuards(AdminGuard)
  restock(@Param('id') id: string, @Body() restockDto: RestockDto) {
    return this.inventoryService.restock(+id, restockDto);
  }
}

