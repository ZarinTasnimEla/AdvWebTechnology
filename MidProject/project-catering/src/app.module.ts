import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItemModule } from './food-item/food-item.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { FoodItem } from './food-item/food-item.entity';
import { Invoice } from './invoice/invoice.entity';
import { Menu } from './menu/menu.entity';
import { Order } from './order/order.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { InvoiceModule } from './invoice/invoice.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // To make config service available everywhere
      envFilePath: 'src/email/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'cateringdb',
      entities: [FoodItem, Invoice, Menu, Order, User],
      synchronize: true, //auto creates tables, i need 'false' while production
    }),
    FoodItemModule,
    MenuModule,
    OrderModule,
    InvoiceModule,
    JwtModule.register({
      global: true,
      secret: 'bhulegesi',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    EmailModule,
  ],
})
export class AppModule {}
