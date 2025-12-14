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

  async purchaseMultiple(items: { id: number; quantity: number }[]) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const updatedSweets = [];

        for (const item of items) {
          const sweet = await tx.sweet.findUnique({
            where: { id: item.id },
          });

          if (!sweet) {
            throw new NotFoundException(`Sweet with ID ${item.id} not found`);
          }

          if (sweet.quantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient quantity for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${item.quantity}`,
            );
          }

          const updated = await tx.sweet.update({
            where: { id: item.id },
            data: {
              quantity: sweet.quantity - item.quantity,
            },
          });

          updatedSweets.push(updated);
        }

        return updatedSweets;
      });

      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to process purchase: ' + error.message);
    }
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

