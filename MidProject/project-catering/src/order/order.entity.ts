import { User } from 'src/auth/user.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Menu } from 'src/menu/menu.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[]; // **Foreign key reference to Menu (simple way) mone rakhte hobeee

  @Column()
  quantity: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' }) // More correct for default date
  orderDate: Date;

}
