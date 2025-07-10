import { Module } from '@nestjs/common';
import { FoodApiController } from './food-api.controller';
import { FdcModule } from './modules/fdc/fdc.module';
import { FoodApiService } from './food-api.service';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [FdcModule, CacheModule],
  controllers: [FoodApiController],
  providers: [FoodApiService],
})
export class FoodApiModule {}
