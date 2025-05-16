import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, DatabaseConfig, HashingConfig, JwtConfig } from '@/config';
import { AuthModule } from '../auth/auth.module';
import { FoodsModule } from '../foods/foods.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig, AppConfig, JwtConfig, HashingConfig],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    FoodsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
