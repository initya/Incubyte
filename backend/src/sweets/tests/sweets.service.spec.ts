import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SweetsService } from '../sweets.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SweetsService', () => {
  let service: SweetsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    sweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SweetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SweetsService>(SweetsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a sweet', async () => {
      const createSweetDto = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const mockSweet = {
        id: 1,
        ...createSweetDto,
      };

      mockPrismaService.sweet.create.mockResolvedValue(mockSweet);

      const result = await service.create(createSweetDto);

      expect(result).toEqual(mockSweet);
      expect(mockPrismaService.sweet.create).toHaveBeenCalledWith({
        data: createSweetDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all sweets', async () => {
      const mockSweets = [
        { id: 1, name: 'Sweet 1', category: 'Category 1', price: 1.99, quantity: 10 },
        { id: 2, name: 'Sweet 2', category: 'Category 2', price: 2.99, quantity: 20 },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(mockSweets);

      const result = await service.findAll();

      expect(result).toEqual(mockSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: 'asc' },
      });
    });

    it('should filter sweets by search term', async () => {
      const mockSweets = [
        { id: 1, name: 'Chocolate Bar', category: 'Chocolate', price: 5.99, quantity: 100 },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(mockSweets);

      const result = await service.findAll('Chocolate');

      expect(result).toEqual(mockSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalled();
    });

    it('should filter sweets by price range', async () => {
      const mockSweets = [
        { id: 1, name: 'Sweet 1', category: 'Category 1', price: 2.99, quantity: 10 },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(mockSweets);

      const result = await service.findAll(undefined, 1.0, 5.0);

      expect(result).toEqual(mockSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalled();
    });

    it('should filter sweets by search term and price range', async () => {
      const mockSweets = [
        { id: 1, name: 'Chocolate Bar', category: 'Chocolate', price: 5.99, quantity: 100 },
      ];

      mockPrismaService.sweet.findMany.mockResolvedValue(mockSweets);

      const result = await service.findAll('Chocolate', 1.0, 10.0);

      expect(result).toEqual(mockSweets);
      expect(mockPrismaService.sweet.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a sweet by id', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(mockSweet);

      const result = await service.findOne(1);

      expect(result).toEqual(mockSweet);
      expect(mockPrismaService.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if sweet not found', async () => {
      mockPrismaService.sweet.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sweet', async () => {
      const existingSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const updateDto = { price: 6.99 };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrismaService.sweet.update.mockResolvedValue({
        ...existingSweet,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);

      expect(result.price).toBe(6.99);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });
  });

  describe('updateFull', () => {
    it('should fully update a sweet', async () => {
      const existingSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const fullUpdateDto = {
        name: 'New Chocolate Bar',
        category: 'New Category',
        price: 7.99,
        quantity: 200,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrismaService.sweet.update.mockResolvedValue({
        id: 1,
        ...fullUpdateDto,
      });

      const result = await service.updateFull(1, fullUpdateDto);

      expect(result.name).toBe('New Chocolate Bar');
      expect(result.price).toBe(7.99);
      expect(mockPrismaService.sweet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: fullUpdateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a sweet', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      mockPrismaService.sweet.findUnique.mockResolvedValue(mockSweet);
      mockPrismaService.sweet.delete.mockResolvedValue(mockSweet);

      const result = await service.remove(1);

      expect(result).toEqual(mockSweet);
      expect(mockPrismaService.sweet.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

