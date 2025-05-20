import { IsNotEmpty, IsString, IsOptional, ValidateNested, isNumberString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFoodItemDto } from '../../food-item/dto/create-food-item.dto';

export class CreateMenuDto {
  @IsNotEmpty({ message: 'Menu Name is required'})
  @IsString({ message: 'Menu Name must be a string'})
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'Description must be a string'})
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  foodItems: number[];
}