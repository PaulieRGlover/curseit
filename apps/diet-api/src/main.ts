/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService, ConfigType } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppModule } from './modules/app/app.module';
import { AppConfig } from './config';
import fastifyCors from '@fastify/cors';

const LOCALHOST_REG_EXP = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

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
  const appConfig = configService.get<ConfigType<typeof AppConfig>>('app');
  if (!appConfig) {
    throw new Error('No appConfig present');
  }

  if (appConfig.mode === 'local_development') {
    await fastifyInstance.register(fastifyCors, {
      origin: (origin, callback) => {
        if (!origin || LOCALHOST_REG_EXP.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed'), false);
        }
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  }

  const { port } = appConfig;

  await app.listen(port ?? 3000);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
