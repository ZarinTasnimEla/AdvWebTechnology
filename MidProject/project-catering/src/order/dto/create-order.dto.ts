import { IsNotEmpty, IsNumber, IsString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Customer Name is required'})
  @IsString({ message: 'Customer Name must be a string'})
  customerName: string;

  @IsNotEmpty({ message: 'Quantity is required'})
  @IsNumber({},{ message: 'Quantity must be a number'})
  quantity: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  menuIds: number[]; // List of Menu IDs
}
