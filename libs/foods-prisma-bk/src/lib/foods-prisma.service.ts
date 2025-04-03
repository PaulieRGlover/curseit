import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma-client-js';
import { ConfigService, ConfigType } from '@nestjs/config';
import { foodsPrismaConfig } from '../config/foods-prisma.config';

@Injectable()
export class FoodsPrismaService extends PrismaClient {
  constructor(
    readonly config: ConfigService<ConfigType<typeof foodsPrismaConfig>>,
  ) {
    super({
      datasources: {
        db: { url: config.get('db') },
      },
    });
  }
}
