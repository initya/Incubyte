import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SweetsModule } from './sweets/sweets.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SweetsModule,
    InventoryModule,
  ],
})
export class AppModule {}

