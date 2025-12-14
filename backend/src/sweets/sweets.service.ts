import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSweetDto: CreateSweetDto) {
    return this.prisma.sweet.create({
      data: createSweetDto,
    });
  }

  async findAll(search?: string, minPrice?: number, maxPrice?: number) {
    const where: any = {};

    // Search by name or category (OR condition) - SQLite compatible
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { category: { contains: search } },
      ];
    }

    // Price range filter (AND condition with search)
    const priceFilter: any = {};
    if (minPrice !== undefined) {
      priceFilter.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      priceFilter.lte = maxPrice;
    }
    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }

    return this.prisma.sweet.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new NotFoundException(`Sweet with ID ${id} not found`);
    }

    return sweet;
  }

  async update(id: number, updateSweetDto: UpdateSweetDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.sweet.update({
      where: { id },
      data: updateSweetDto,
    });
  }

  async updateFull(id: number, createSweetDto: CreateSweetDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.sweet.update({
      where: { id },
      data: createSweetDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.sweet.delete({
      where: { id },
    });
  }
}

