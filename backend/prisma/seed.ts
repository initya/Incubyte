import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetshop.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@sweetshop.com',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample sweets with real images from the internet
  const sweets = [
    {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 5.99,
      quantity: 100,
      imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4cbc5b52?w=500&h=300&fit=crop',
    },
    {
      name: 'Gummy Bears',
      category: 'Gummies',
      price: 3.99,
      quantity: 150,
      imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&h=300&fit=crop',
    },
    {
      name: 'Lollipop',
      category: 'Hard Candy',
      price: 1.99,
      quantity: 200,
      imageUrl: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=500&h=300&fit=crop',
    },
    {
      name: 'Jelly Beans',
      category: 'Jelly',
      price: 4.99,
      quantity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&h=300&fit=crop',
    },
    {
      name: 'Caramel Toffee',
      category: 'Caramel',
      price: 6.99,
      quantity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=300&fit=crop',
    },
    {
      name: 'Sour Patch Kids',
      category: 'Sour',
      price: 4.49,
      quantity: 90,
      imageUrl: 'https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=500&h=300&fit=crop',
    },
    {
      name: 'Cotton Candy',
      category: 'Fluffy',
      price: 3.49,
      quantity: 110,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=300&fit=crop',
    },
    {
      name: 'Marshmallows',
      category: 'Soft',
      price: 4.99,
      quantity: 130,
      imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=500&h=300&fit=crop',
    },
    {
      name: 'Licorice',
      category: 'Chewy',
      price: 2.99,
      quantity: 95,
      imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&h=300&fit=crop',
    },
    {
      name: 'Rock Candy',
      category: 'Hard Candy',
      price: 3.99,
      quantity: 140,
      imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop',
    },
    {
      name: 'Fudge',
      category: 'Chocolate',
      price: 7.99,
      quantity: 75,
      imageUrl: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&h=300&fit=crop',
    },
    {
      name: 'Taffy',
      category: 'Chewy',
      price: 3.29,
      quantity: 160,
      imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop',
    },
  ];

  for (const sweet of sweets) {
    const existing = await prisma.sweet.findFirst({
      where: { name: sweet.name },
    });
    
    if (!existing) {
      await prisma.sweet.create({
        data: sweet,
      });
      console.log(`✅ Sweet created: ${sweet.name}`);
    } else {
      // Always update existing sweet with context-specific image
      await prisma.sweet.update({
        where: { id: existing.id },
        data: { imageUrl: sweet.imageUrl },
      });
      console.log(`🖼️  Image updated for: ${sweet.name}`);
    }
  }

  console.log('🎉 Database seed completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: admin@sweetshop.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
