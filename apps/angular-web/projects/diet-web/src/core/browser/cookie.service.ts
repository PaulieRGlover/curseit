import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Nullable } from '@curseit/types';

@Injectable({ providedIn: 'root' })
export class CookieService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  public getCookie(name: string): Nullable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const match = this.document.cookie.split('; ').find(cookie => cookie.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }
}
