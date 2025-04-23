import { databaseConfig } from '@/config';
import { getDietPrismaClient, PrismaClient } from '@curseit/diet-prisma';
import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class PrismaService {
  db: PrismaClient = getDietPrismaClient(this.config.url);

  constructor(
    @Inject(databaseConfig.KEY)
    private readonly config: ConfigType<typeof databaseConfig>,
  ) {}
}
