// food-item/food-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from '../menu/menu.entity';

@Entity()
export class FoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category?: string;

  @ManyToOne(() => Menu, (menu) => menu.foodItems, { nullable: true })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu | null;

  @Column('jsonb', { nullable: true }) // Store media file paths as a JSON array
  media?: string[];
}