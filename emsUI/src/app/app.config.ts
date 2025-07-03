import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_URL } from 'tokens/api-url.token';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { HttpInterceptorFn } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    { provide: API_URL, useValue: 'http://localhost:8000/api/v1' }
  ]
}; 