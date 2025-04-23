import { DietPrismaClient, PrismaClient } from '@curseit/diet-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService {
  client: PrismaClient = DietPrismaClient;
}
