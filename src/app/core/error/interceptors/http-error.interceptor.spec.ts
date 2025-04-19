import {
    HttpErrorResponse,
    HttpRequest,
    HttpContext,
} from '@angular/common/http';
import { httpErrorInterceptor } from './http-error.interceptor';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { LogService } from '../services/log.service';
import {
    OfflineService,
    IGNORE_ERROR_INTERCEPTOR,
} from '../services/offline.service';
import { of, throwError } from 'rxjs';

describe('HttpErrorInterceptor', () => {
    let routerSpy: jasmine.SpyObj<Router>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let offlineServiceSpy: jasmine.SpyObj<OfflineService>;

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
            'showError',
            'showWarning',
            'showInfo',
        ]);
        logServiceSpy = jasmine.createSpyObj('LogService', ['log']);
        offlineServiceSpy = jasmine.createSpyObj('OfflineService', ['log']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerSpy },
                {
                    provide: NotificationService,
                    useValue: notificationServiceSpy,
                },
                { provide: LogService, useValue: logServiceSpy },
                { provide: OfflineService, useValue: offlineServiceSpy },
            ],
        });
    });

    it('should ignore requests with IGNORE_ERROR_INTERCEPTOR context', () => {
        const request = new HttpRequest('GET', '/test');
        const context = new HttpContext().set(IGNORE_ERROR_INTERCEPTOR, true);
        const requestWithContext = request.clone({ context });
        const next = jasmine.createSpy('next').and.returnValue(of({}));

        httpErrorInterceptor(requestWithContext, next);

        expect(next).toHaveBeenCalledWith(requestWithContext);
    });

    it('should handle offline errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(false);
        const request = new HttpRequest('GET', '/test');
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => new HttpErrorResponse({})));

        httpErrorInterceptor(request, next).subscribe();

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Você está offline. Verifique sua conexão e tente novamente.',
        );
    });

    it('should handle status 0 errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({ status: 0, url: '/test' });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(offlineServiceSpy.log).toHaveBeenCalled();
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Servidor indisponível. Tente novamente em alguns minutos.',
        );
    });

    it('should handle 401 errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({ status: 401 });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(notificationServiceSpy.showWarning).toHaveBeenCalledWith(
            'Sua sessão expirou. Faça login novamente.',
        );
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle 403 errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({ status: 403 });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(notificationServiceSpy.showWarning).toHaveBeenCalledWith(
            'Você não tem permissão para acessar este recurso',
        );
    });

    it('should handle 404 errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({ status: 404 });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(notificationServiceSpy.showInfo).toHaveBeenCalledWith(
            'O recurso solicitado não foi encontrado',
        );
    });

    it('should handle 500 errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({ status: 500, url: '/test' });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(logServiceSpy.log).toHaveBeenCalled();
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Ocorreu um erro no servidor. Tente novamente em alguns minutos.',
        );
    });

    it('should handle unknown errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({
            status: 418,
            statusText: "I'm a teapot",
        });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            "Ocorreu um erro: I'm a teapot",
        );
    });

    it('should retry 500 errors', () => {
        spyOnProperty(navigator, 'onLine', 'get').and.returnValue(true);
        const request = new HttpRequest('GET', '/test');
        const error = new HttpErrorResponse({ status: 500 });
        const next = jasmine
            .createSpy('next')
            .and.returnValue(throwError(() => error));

        httpErrorInterceptor(request, next).subscribe();

        expect(next).toHaveBeenCalledTimes(3); // Initial call + 2 retries
    });
});
