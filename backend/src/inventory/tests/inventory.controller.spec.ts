import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('InventoryController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let adminToken: string;
  let sweetId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    
    // Add validation pipes like in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    // Clean up before tests
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['inventoryuser@test.com', 'inventoryadmin@test.com'],
        },
      },
    });

    // Create test user
    const userRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'inventoryuser@test.com',
        password: '123456',
      });
    authToken = userRes.body.token;

    // Create admin user
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'inventoryadmin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'inventoryadmin@test.com',
        password: '123456',
      });
    adminToken = adminRes.body.token;

    // Create a test sweet
    const sweetRes = await request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Sweet',
        category: 'Test',
        price: 5.99,
        quantity: 100,
      });
    sweetId = sweetRes.body.id;
  });

  afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['inventoryuser@test.com', 'inventoryadmin@test.com'],
        },
      },
    });
    await app.close();
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 10,
        });

      expect(res.status).toBe(201);
      expect(res.body.quantity).toBe(90);
    });

    it('should not allow purchase if quantity is insufficient', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 1000,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Insufficient quantity');
    });

    it('should return 404 for non-existent sweet', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/sweets/99999/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 1,
        });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock a sweet (admin only)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 50,
        });

      expect(res.status).toBe(201);
      expect(res.body.quantity).toBeGreaterThan(90);
    });

    it('should not allow regular user to restock', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 10,
        });

      expect(res.status).toBe(403);
    });
  });
});

