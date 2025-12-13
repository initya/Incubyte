import { IsNumber, IsPositive, Min } from 'class-validator';

export class PurchaseDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

