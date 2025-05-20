import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { FoodItem } from '../food-item/food-item.entity';
import { AuthModule } from '../auth/auth.module';
import { FoodItemModule } from 'src/food-item/food-item.module';


@Module({
  imports: [TypeOrmModule.forFeature([Menu, FoodItem]), AuthModule,],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}