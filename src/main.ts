import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(App,  {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes)
  ]
})
  
