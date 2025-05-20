import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItem } from './food-item.entity';
import { FoodItemService } from './food-item.service';
import { FoodItemController } from './food-item.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Menu } from 'src/menu/menu.entity';
import { MenuController } from 'src/menu/menu.controller';
import { MenuService } from 'src/menu/menu.service';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItem]), AuthModule, MenuModule],
  controllers: [FoodItemController],
  providers: [FoodItemService, AuthGuard],
  exports: [FoodItemService],
})
export class FoodItemModule {}
