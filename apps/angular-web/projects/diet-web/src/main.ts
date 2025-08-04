import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { CidApp } from './app/app';

bootstrapApplication(CidApp, appConfig)
  .catch((err) => console.error(err));
