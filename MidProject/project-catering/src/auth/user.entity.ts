import { Order } from 'src/order/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];
  get role(): 'admin' | 'customer' {
    // First user becomes admin, others customers
    return this.id === 1 ? 'admin' : 'customer';
  }
  
}


