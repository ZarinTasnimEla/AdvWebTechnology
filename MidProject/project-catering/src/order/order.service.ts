import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Menu } from 'src/menu/menu.entity';
import { InvoiceService } from 'src/invoice/invoice.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>, 
    private invoiceService: InvoiceService 
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerName, quantity, menuIds } = createOrderDto;
  
    const menus = await this.menuRepository.findByIds(menuIds);
    if (menus.length !== menuIds.length) {
      throw new NotFoundException('One or more menu IDs are invalid');
    }

    const order = this.orderRepository.create({
      customerName,
      quantity,
      menus,
    });
    const savedOrder = await this.orderRepository.save(order);

    // here im creating invoice after saving order
    await this.invoiceService.createInvoice(savedOrder);

    return savedOrder;
  }
  

  findAll() {
    return this.orderRepository.find({ relations: ['menus'] }); // Optional: include menu data
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['menu'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: CreateOrderDto): Promise<Order> {
    const { customerName, quantity, menuIds } = updateOrderDto;
  
    const order = await this.findById(id);
  
    const menus = await this.menuRepository.findByIds(menuIds);
    if (menus.length !== menuIds.length) {
      throw new NotFoundException(`Some Menu IDs are invalid`);
    }
  
    order.customerName = customerName;
    order.quantity = quantity;
    order.menus = menus;
  
    return this.orderRepository.save(order);
  }
  

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findById(id);
    await this.orderRepository.remove(order);
    return { message: `Order with ID ${id} has been deleted.` };
  }
}
