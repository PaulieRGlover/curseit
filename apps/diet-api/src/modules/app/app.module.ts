import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfig, DatabaseConfig, HashingConfig, JwtConfig } from '@/config';

import { AuthModule } from '../auth/auth.module';
import { FoodApiModule } from '../food-api/food-api.module';
import { FoodModule } from '../food/food.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { ValidationModule } from '../validation/validation.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, AppConfig, JwtConfig, HashingConfig],
    }),
    PrismaModule,
    ValidationModule,
    AuthModule,
    UserModule,
    FoodModule,
    FoodApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
