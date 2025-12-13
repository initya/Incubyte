import { IsString, IsNumber, IsPositive, Min, IsOptional, IsUrl } from 'class-validator';

export class CreateSweetDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

