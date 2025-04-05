import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FoodsModule } from '../foods/foods.module';

@Module({
  imports: [FoodsModule],
  controllers: [AppController],
})
export class AppModule {}
