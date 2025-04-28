/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import 'dotenv/config';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ZodValidationPipe(),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.register(fastifyCookie);

  const configService = app.get(ConfigService);
  const { port } = configService.get<{ port: number }>('app') ?? {};

  await app.listen(port ?? 3000);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
