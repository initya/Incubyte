import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryService } from '../inventory.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockPrismaService = {
    sweet: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('purchase', () => {
    it('should decrease quantity when purchasing', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const purchaseDto = { quantity: 10 };

      mockPrismaService.sweet.findUnique.mockResolvedValue(mockSweet);
      mockPrismaService.sweet.update.mockResolvedValue({
        ...mockSweet,
        quantity: 90,
      });

      const result = await service.purchase(1, purchaseDto);

      expect(result.quantity).toBe(90);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 90 },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(
        service.purchase(999, { quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if insufficient quantity', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        quantity: 5,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(mockSweet);

      await expect(
        service.purchase(1, { quantity: 10 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('restock', () => {
    it('should increase quantity when restocking', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 50,
      };

      const restockDto = { quantity: 25 };

      mockPrismaService.sweet.findUnique.mockResolvedValue(mockSweet);
      mockPrismaService.sweet.update.mockResolvedValue({
        ...mockSweet,
        quantity: 75,
      });

      const result = await service.restock(1, restockDto);

      expect(result.quantity).toBe(75);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 75 },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(
        service.restock(999, { quantity: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

