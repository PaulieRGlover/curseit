import { Global, Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

import { PrismaClient } from '@curseit/foods-orm';

import { DatabaseConfig } from '@/config';

@Global()
@Injectable()
export class FoodsPrismaService extends PrismaClient {
  constructor(
    @Inject(DatabaseConfig.KEY)
    databaseConfig: ConfigType<typeof DatabaseConfig>,
  ) {
    super({ datasources: { db: { url: databaseConfig.foodsUrl } } });
  }
}
