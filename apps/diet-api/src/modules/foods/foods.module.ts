import { Module } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FdcModule } from './modules/fdc/fdc.module';
import { FoodsService } from './foods.service';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [FdcModule, CacheModule],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}
