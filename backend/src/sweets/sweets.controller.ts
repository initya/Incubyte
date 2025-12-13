import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('sweets')
@UseGuards(JwtAuthGuard)
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetsService.create(createSweetDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.sweetsService.findAll(
      search,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
    );
  }

  @Get('search')
  search(
    @Query('q') query?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.sweetsService.findAll(
      query,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sweetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetsService.update(+id, updateSweetDto);
  }

  @Put(':id')
  updateFull(@Param('id') id: string, @Body() createSweetDto: CreateSweetDto) {
    return this.sweetsService.updateFull(+id, createSweetDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.sweetsService.remove(+id);
  }
}

