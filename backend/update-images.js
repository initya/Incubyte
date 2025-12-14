const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
  const sweets = [
    { name: 'Chocolate Bar', imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4cbc5b52?w=500&h=300&fit=crop' },
    { name: 'Gummy Bears', imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&h=300&fit=crop' },
    { name: 'Lollipop', imageUrl: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=500&h=300&fit=crop' },
    { name: 'Jelly Beans', imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&h=300&fit=crop' },
    { name: 'Caramel Toffee', imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=300&fit=crop' },
    { name: 'Sour Patch Kids', imageUrl: 'https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=500&h=300&fit=crop' },
    { name: 'Cotton Candy', imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=300&fit=crop' },
    { name: 'Marshmallows', imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=500&h=300&fit=crop' },
    { name: 'Licorice', imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop' },
    { name: 'Rock Candy', imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop' },
    { name: 'Fudge', imageUrl: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&h=300&fit=crop' },
    { name: 'Taffy', imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=300&fit=crop' },
  ];

  for (const sweet of sweets) {
    const existing = await prisma.sweet.findFirst({ where: { name: sweet.name } });
    if (existing) {
      await prisma.sweet.update({
        where: { id: existing.id },
        data: { imageUrl: sweet.imageUrl }
      });
      console.log(`✅ Updated: ${sweet.name}`);
    }
  }
  
  console.log('🎉 All images updated!');
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
