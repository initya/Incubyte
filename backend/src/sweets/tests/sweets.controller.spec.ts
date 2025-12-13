import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('SweetsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let adminToken: string;

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
          in: ['user@test.com', 'admin@test.com'],
        },
      },
    });

    // Create test user
    const userRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: '123456',
      });
    authToken = userRes.body.token;

    // Create admin user
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    });

    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: '123456',
      });
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['user@test.com', 'admin@test.com'],
        },
      },
    });
    await app.close();
  });

  describe('POST /api/sweets', () => {
    it('should create a sweet (admin only)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 100,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Chocolate Bar');
      expect(res.body.price).toBe(5.99);
    });

    it('should not allow regular user to create sweet', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Test',
          price: 1.99,
          quantity: 50,
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should search sweets by name/category', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sweets/search?q=Chocolate')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sweets/search?minPrice=1.0&maxPrice=10.0')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should search sweets by name and price range', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sweets/search?q=Chocolate&minPrice=1.0&maxPrice=10.0')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/sweets/:id', () => {
    it('should get a sweet by id', async () => {
      // First create a sweet
      const createRes = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Gummies',
          price: 3.99,
          quantity: 75,
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body).toHaveProperty('id');
      
      const sweetId = createRes.body.id;

      const res = await request(app.getHttpServer())
        .get(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(sweetId);
      expect(res.body.name).toBe('Gummy Bears');
    });

    it('should return 404 for non-existent sweet', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/sweets/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/sweets/:id', () => {
    it('should update a sweet (partial update)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Lollipop',
          category: 'Hard Candy',
          price: 1.99,
          quantity: 50,
        });

      const sweetId = createRes.body.id;

      const res = await request(app.getHttpServer())
        .patch(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          price: 2.49,
        });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(2.49);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update a sweet (full update)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Original Sweet',
          category: 'Original',
          price: 1.99,
          quantity: 50,
        });

      const sweetId = createRes.body.id;

      const res = await request(app.getHttpServer())
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Sweet',
          category: 'Updated',
          price: 3.99,
          quantity: 100,
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Sweet');
      expect(res.body.category).toBe('Updated');
      expect(res.body.price).toBe(3.99);
      expect(res.body.quantity).toBe(100);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete a sweet (admin only)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'To Delete',
          category: 'Test',
          price: 1.00,
          quantity: 10,
        });

      const sweetId = createRes.body.id;

      const res = await request(app.getHttpServer())
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Verify it's deleted
      const getRes = await request(app.getHttpServer())
        .get(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    it('should not allow regular user to delete sweet', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Protected Sweet',
          category: 'Test',
          price: 1.00,
          quantity: 10,
        });

      const sweetId = createRes.body.id;

      const res = await request(app.getHttpServer())
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(403);
    });
  });
});

