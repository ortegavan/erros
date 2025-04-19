import {
    ApplicationConfig,
    ErrorHandler,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/error/interceptors/http-error.interceptor';
import { GlobalErrorHandler } from './core/error/handlers/global-error.handler';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ],
};
