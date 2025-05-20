import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { FoodItem } from 'src/food-item/food-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const { name, description, foodItems } = createMenuDto;

    const foodItemEntities = await this.foodItemRepository.findByIds(foodItems);
    if (foodItemEntities.length !== foodItems.length) {
      throw new NotFoundException('Some food items not found');
    }

    const menu = this.menuRepository.create({
      name,
      description,
      foodItems: foodItemEntities,
    });

    return this.menuRepository.save(menu);
  }

  findAll() {
    return this.menuRepository.find({ relations: ['foodItems'] });
  }

  async findById(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
        where:{id},
        relations: ['foodItems']
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: number, updateMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = await this.findById(id);
    const updatedMenu = Object.assign(menu, updateMenuDto);
    return this.menuRepository.save(updatedMenu);
  }

  async remove(id: number): Promise<{ message: string }> {
    const menu = await this.findById(id);
    await this.menuRepository.remove(menu);
    return { message: `Menu with ID ${id} has been deleted.` };
  }
}
