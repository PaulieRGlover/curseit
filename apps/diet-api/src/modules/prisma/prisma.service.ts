import { Global, Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

import { PrismaClient } from '@curseit/diet-orm';

import { DatabaseConfig } from '@/config';

@Global()
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    @Inject(DatabaseConfig.KEY)
    databaseConfig: ConfigType<typeof DatabaseConfig>,
  ) {
    super({ datasources: { db: { url: databaseConfig.url } } });
  }
}
