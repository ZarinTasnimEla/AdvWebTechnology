import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodItem } from './food-item.entity';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { Menu } from '../menu/menu.entity';

@Injectable()
export class FoodItemService {
  constructor(
    @InjectRepository(FoodItem)
    private readonly foodItemRepository: Repository<FoodItem>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    let menu: Menu | null = null;
    
    if (createFoodItemDto.menuId) {
      menu = await this.menuRepository.findOneBy({ id: createFoodItemDto.menuId });
      if (!menu) {
        throw new NotFoundException(`Menu with ID ${createFoodItemDto.menuId} not found`);
      }
    }

    const foodItem = this.foodItemRepository.create({
      name: createFoodItemDto.name,
      price: createFoodItemDto.price,
      menu: menu
    });

    return this.foodItemRepository.save(foodItem);
  }

  findAll() {
    return this.foodItemRepository.find({ relations: ['menu'] });
  }

  async findById(id: number): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.findOne({
      where: { id },
      relations: ['menu']
    });
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return foodItem;
  }

  async update(id: number, updateFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    const foodItem = await this.findById(id);
    
    if (updateFoodItemDto.menuId !== undefined) {
      foodItem.menu = updateFoodItemDto.menuId 
        ? await this.menuRepository.findOneBy({ id: updateFoodItemDto.menuId })
        : null;
      
      if (updateFoodItemDto.menuId && !foodItem.menu) {
        throw new NotFoundException(`Menu with ID ${updateFoodItemDto.menuId} not found`);
      }
    }

    if (updateFoodItemDto.name !== undefined) {
      foodItem.name = updateFoodItemDto.name;
    }
    
    if (updateFoodItemDto.price !== undefined) {
      foodItem.price = updateFoodItemDto.price;
    }

    return this.foodItemRepository.save(foodItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.foodItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
  }
}