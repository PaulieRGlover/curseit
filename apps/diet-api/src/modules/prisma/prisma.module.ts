import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { FoodsPrismaService } from './foods-prisma.service';

@Global()
@Module({
  providers: [PrismaService, FoodsPrismaService],
  exports: [PrismaService, FoodsPrismaService],
})
export class PrismaModule {}
