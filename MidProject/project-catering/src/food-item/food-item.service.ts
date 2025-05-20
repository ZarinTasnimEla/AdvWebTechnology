// food-item.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { FoodItem } from './food-item.entity';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class FoodItemService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    return this.foodItemRepository.save(this.foodItemRepository.create(createFoodItemDto));
  }

  findAll(query?: any) {
    if (!query || Object.keys(query).length === 0) {
      return this.foodItemRepository.find(); // Return all if no query
    }

    const where: any = {};
    const lowerCaseQuery: any = {};
    for (const key in query) {
      lowerCaseQuery[key.toLowerCase()] = query[key];
    }

    if (lowerCaseQuery.name) {
      where.name = Like(`%${lowerCaseQuery.name}%`); // Case-insensitive search
    }
    if (lowerCaseQuery.category) {
      where.category = lowerCaseQuery.category; // Case-sensitive category search
    }
    if (lowerCaseQuery.minprice) {
      where.price = { ...where.price, $gte: parseFloat(lowerCaseQuery.minprice) };
    }
    if (lowerCaseQuery.maxprice) {
      where.price = { ...where.price, $lte: parseFloat(lowerCaseQuery.maxprice) };
    }

    return this.foodItemRepository.find({ where });
  }

  async findById(id: number): Promise<FoodItem> {
    const foodItem = await this.foodItemRepository.findOneBy({ id });
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return foodItem;
  }

  async update(id: number, updateFoodItemDto: CreateFoodItemDto): Promise<FoodItem> {
    const foodItem = await this.findById(id);
    Object.assign(foodItem, updateFoodItemDto);
    return this.foodItemRepository.save(foodItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.foodItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
  }

  async addMedia(foodItemId: number, filePaths: string[]): Promise<FoodItem> {
    const foodItem = await this.findById(foodItemId);
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${foodItemId} not found`);
    }
    foodItem.media = filePaths;
    return this.foodItemRepository.save(foodItem);
  }

  async getFoodItemPdfBuffer(filename: string): Promise<Buffer | null> {
    const filePath = path.join('./uploads/food-item-media', filename);
    if (existsSync(filePath)) {
      try {
        return readFileSync(filePath);
      } catch (error) {
        console.error('Error reading PDF file:', error);
        return null;
      }
    }
    return null;
  }
}