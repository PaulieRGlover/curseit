import { DietPrismaClient, PrismaClient } from '@curseit/diet-prisma';
import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class PrismaService extends DietPrismaClient {
  constructor() {
    super({ datasources: { db: { url: process.env.DATABASE_URL } } });
  }
}
