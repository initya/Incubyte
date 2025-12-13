import { Module } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { SweetsController } from './sweets.controller';

@Module({
  controllers: [SweetsController],
  providers: [SweetsService],
  exports: [SweetsService],
})
export class SweetsModule {}

