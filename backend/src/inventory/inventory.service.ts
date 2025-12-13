import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseDto } from './dto/purchase.dto';
import { RestockDto } from './dto/restock.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async purchase(sweetId: number, purchaseDto: PurchaseDto) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      throw new NotFoundException(`Sweet with ID ${sweetId} not found`);
    }

    if (sweet.quantity < purchaseDto.quantity) {
      throw new BadRequestException('Insufficient quantity available');
    }

    return this.prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: sweet.quantity - purchaseDto.quantity,
      },
    });
  }

  async restock(sweetId: number, restockDto: RestockDto) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id: sweetId },
    });

    if (!sweet) {
      throw new NotFoundException(`Sweet with ID ${sweetId} not found`);
    }

    return this.prisma.sweet.update({
      where: { id: sweetId },
      data: {
        quantity: sweet.quantity + restockDto.quantity,
      },
    });
  }
}

