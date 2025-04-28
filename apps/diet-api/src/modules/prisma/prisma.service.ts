import { Global, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@curseit/diet-orm';
import { databaseConfig } from '@/config';
import { type ConfigType } from '@nestjs/config';

@Global()
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    @Inject(databaseConfig.KEY)
    config: ConfigType<typeof databaseConfig>,
  ) {
    super({ datasources: { db: { url: config.url } } });
  }
}
