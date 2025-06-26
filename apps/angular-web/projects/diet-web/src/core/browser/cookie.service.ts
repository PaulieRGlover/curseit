import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Nullable } from '@curseit/types';

@Injectable({ providedIn: 'root' })
export class CookieService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  public getCookie(name: string): Nullable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const match = this.document.cookie.split('; ').find(cookie => cookie.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }
}
