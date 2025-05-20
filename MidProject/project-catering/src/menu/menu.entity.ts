import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FoodItem } from '../food-item/food-item.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => FoodItem, (foodItem) => foodItem.menu)
  foodItems: FoodItem[];
}