import { IsNumber, IsPositive, Min } from 'class-validator';

export class RestockDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

