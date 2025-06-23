import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

const ABSOLUTE_URL_REG_EXP = /^https?:\/\//;

export const baseInterceptor = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (ABSOLUTE_URL_REG_EXP.test(request.url)) {
    return next(request);
  }

  const apiRequest = request.clone({
    url: `${environment.apiBaseUrl}/${request.url}`,
    withCredentials: true,
  });

  return next(apiRequest);
};
