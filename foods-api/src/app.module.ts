import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodsPrismaModule } from '@affable-apps/foods-prisma';

@Module({
  imports: [
    FoodsPrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
