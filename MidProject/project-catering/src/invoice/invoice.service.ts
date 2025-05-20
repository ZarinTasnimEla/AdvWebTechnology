// invoice.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { FoodItemService } from 'src/food-item/food-item.service';
import { Order } from 'src/order/order.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    private dataSource: DataSource,
  ) {}

  async createInvoice(order: Order): Promise<Invoice> {
    const totalAmount = order.menus.reduce((sum, menu) => sum + (menu['price'] || 0), 0) * order.quantity;

    const invoice = this.invoiceRepo.create({
      order,
      totalAmount,
    });

    return this.invoiceRepo.save(invoice);
  }
}

// {
//     "customerName": "Wasifa Tasnim Mrittika",
//     "menuIds": [3],
//     "quantity": 10
//   }