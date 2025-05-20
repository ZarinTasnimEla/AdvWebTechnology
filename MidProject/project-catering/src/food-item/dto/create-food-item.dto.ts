import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFoodItemDto {
  @IsNotEmpty({ message: 'Food-Item Name is required'})
  @IsString({ message: 'Food-Item Name must be a string'})
  name: string;

  @IsNotEmpty({ message: 'Price is required'})
  @IsNumber({},{ message: 'Price must be a number'})
  @Min(1, { message: 'Price must be at least 1bdt' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @Type(() => Number)
  menuId?: number | null;

  @IsNotEmpty()
  @IsEnum(['Appetizer', 'Main Course', 'Dessert', 'Beverage'], {
    message: 'Invalid category'
  })
  @IsString({ message: 'Category must be a string'})
  category: string;
}