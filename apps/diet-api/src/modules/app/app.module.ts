import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, jwtConfig } from '@/config';
import { AuthModule } from '../auth/auth.module';
import { FoodsModule } from '../foods/foods.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig],
    }),
    AuthModule,
    FoodsModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
