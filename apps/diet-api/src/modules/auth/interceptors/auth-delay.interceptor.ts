import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { lastValueFrom, Observable } from 'rxjs';

import { AppConfig } from '@/config';

@Injectable()
export class AuthDelayInterceptor implements NestInterceptor {
  constructor(
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>
  ) {}

  async intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const delay = new Promise(resolve => setTimeout(resolve, this.appConfig.artificialAuthDelay));
    const start = Date.now();

    const endpoint$ = next.handle();
    const [response] = await Promise.allSettled([
      lastValueFrom(endpoint$),
      delay,
    ]);

    const elapsed = Date.now() - start;
    if (elapsed > this.appConfig.artificialAuthDelay + 10) {
      /**
       * TODO: warn through Sentry that the endpoint takes longer than the delay
       * account for e2e envs
       */
    }

    if (response.status === 'fulfilled') {
      return new Observable(subscriber => {
        subscriber.next(response.value);
        subscriber.complete();
      })
    } else {
      throw response.reason;
    }
  }
}
