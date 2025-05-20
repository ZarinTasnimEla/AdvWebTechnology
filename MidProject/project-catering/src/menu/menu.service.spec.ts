import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { FoodItem } from '../food-item/food-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create({
      name: createMenuDto.name,
      description: createMenuDto.description
    });
    
    const savedMenu = await this.menuRepository.save(menu);
    
    if (createMenuDto.foodItems && createMenuDto.foodItems.length > 0) {
      const foodItems = createMenuDto.foodItems.map(item => 
        this.foodItemRepository.create({
          ...item,
          menu: savedMenu
        })
      );
      await this.foodItemRepository.save(foodItems);
    }
    
    return this.menuRepository.findOne({
      where: { id: savedMenu.id },
      relations: ['foodItems']
    });
  }

  findAll() {
    return this.menuRepository.find({ relations: ['foodItems'] });
  }

  async findById(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['foodItems']
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = await this.findById(id);
    Object.assign(menu, {
      name: updateMenuDto.name,
      description: updateMenuDto.description
    });
    
    return this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<{ message: string }> {
    // First remove all associated food items
    await this.foodItemRepository.delete({ menu: { id } });
    
    // Then remove the menu
    const result = await this.menuRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    
    return { message: `Menu with ID ${id} has been deleted.` };
  }
}