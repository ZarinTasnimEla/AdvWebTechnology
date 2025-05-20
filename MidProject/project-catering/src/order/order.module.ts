import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { Menu } from 'src/menu/menu.entity';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Menu]), AuthModule, InvoiceModule],
  controllers: [OrderController],
  providers: [OrderService, AuthGuard],
})
export class OrderModule {}
