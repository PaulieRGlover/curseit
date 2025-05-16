import { Global, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@curseit/diet-orm';
import { DatabaseConfig } from '@/config';
import { type ConfigType } from '@nestjs/config';

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
