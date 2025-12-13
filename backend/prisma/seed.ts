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

  // Create sample sweets with context-specific placeholder images
  // Each image shows the sweet name for accuracy
  const sweets = [
    {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 5.99,
      quantity: 100,
      imageUrl: 'https://via.placeholder.com/500x300/4A2C2A/FFFFFF?text=Chocolate+Bar',
    },
    {
      name: 'Gummy Bears',
      category: 'Gummies',
      price: 3.99,
      quantity: 150,
      imageUrl: 'https://via.placeholder.com/500x300/FF6B9D/FFFFFF?text=Gummy+Bears',
    },
    {
      name: 'Lollipop',
      category: 'Hard Candy',
      price: 1.99,
      quantity: 200,
      imageUrl: 'https://via.placeholder.com/500x300/FFB6C1/000000?text=Lollipop',
    },
    {
      name: 'Jelly Beans',
      category: 'Jelly',
      price: 4.99,
      quantity: 120,
      imageUrl: 'https://via.placeholder.com/500x300/FF69B4/FFFFFF?text=Jelly+Beans',
    },
    {
      name: 'Caramel Toffee',
      category: 'Caramel',
      price: 6.99,
      quantity: 80,
      imageUrl: 'https://via.placeholder.com/500x300/D2691E/FFFFFF?text=Caramel+Toffee',
    },
    {
      name: 'Sour Patch Kids',
      category: 'Sour',
      price: 4.49,
      quantity: 90,
      imageUrl: 'https://via.placeholder.com/500x300/FFD700/000000?text=Sour+Patch+Kids',
    },
    {
      name: 'Cotton Candy',
      category: 'Fluffy',
      price: 3.49,
      quantity: 110,
      imageUrl: 'https://via.placeholder.com/500x300/FFB6C1/000000?text=Cotton+Candy',
    },
    {
      name: 'Marshmallows',
      category: 'Soft',
      price: 4.99,
      quantity: 130,
      imageUrl: 'https://via.placeholder.com/500x300/FFFFFF/000000?text=Marshmallows',
    },
    {
      name: 'Licorice',
      category: 'Chewy',
      price: 2.99,
      quantity: 95,
      imageUrl: 'https://via.placeholder.com/500x300/1C1C1C/FFFFFF?text=Licorice',
    },
    {
      name: 'Rock Candy',
      category: 'Hard Candy',
      price: 3.99,
      quantity: 140,
      imageUrl: 'https://via.placeholder.com/500x300/FF69B4/FFFFFF?text=Rock+Candy',
    },
    {
      name: 'Fudge',
      category: 'Chocolate',
      price: 7.99,
      quantity: 75,
      imageUrl: 'https://via.placeholder.com/500x300/3D2817/FFFFFF?text=Fudge',
    },
    {
      name: 'Taffy',
      category: 'Chewy',
      price: 3.29,
      quantity: 160,
      imageUrl: 'https://via.placeholder.com/500x300/FFB6C1/000000?text=Taffy',
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
