import { User } from '@/dto';
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User; // comes from jwt.strategy.ts through passport magic
  }
}
