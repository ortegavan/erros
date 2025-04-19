import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error.handler';
import { NotificationService } from '../services/notification.service';
import { LogService } from '../services/log.service';
import { NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

describe('GlobalErrorHandler', () => {
    let handler: GlobalErrorHandler;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let ngZoneSpy: jasmine.SpyObj<NgZone>;

    beforeEach(() => {
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
            'showError',
        ]);
        logServiceSpy = jasmine.createSpyObj('LogService', ['log']);
        ngZoneSpy = jasmine.createSpyObj('NgZone', ['run']);

        TestBed.configureTestingModule({
            providers: [
                GlobalErrorHandler,
                {
                    provide: NotificationService,
                    useValue: notificationServiceSpy,
                },
                { provide: LogService, useValue: logServiceSpy },
                { provide: NgZone, useValue: ngZoneSpy },
            ],
        });

        handler = TestBed.inject(GlobalErrorHandler);
    });

    it('should be created', () => {
        expect(handler).toBeTruthy();
    });

    it('should ignore HttpErrorResponse', () => {
        const error = new HttpErrorResponse({ status: 404 });
        handler.handleError(error);
        expect(logServiceSpy.log).not.toHaveBeenCalled();
        expect(notificationServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should handle Error objects', () => {
        const error = new Error('Test error');
        error.stack = 'Test stack trace';
        handler.handleError(error);

        expect(logServiceSpy.log).toHaveBeenCalledWith({
            message: 'Test error',
            stack: 'Test stack trace',
            url: window.location.href,
            timestamp: jasmine.any(String),
        });
        expect(ngZoneSpy.run).toHaveBeenCalled();
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Ocorreu um erro inesperado. Nossa equipe foi notificada, tente novamente mais tarde.',
        );
    });

    it('should handle string errors', () => {
        const error = 'Test error message';
        handler.handleError(error);

        expect(logServiceSpy.log).toHaveBeenCalledWith({
            message: 'Test error message',
            stack: '',
            url: window.location.href,
            timestamp: jasmine.any(String),
        });
        expect(ngZoneSpy.run).toHaveBeenCalled();
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Ocorreu um erro inesperado. Nossa equipe foi notificada, tente novamente mais tarde.',
        );
    });

    it('should handle unknown error types', () => {
        const error = { some: 'object' };
        handler.handleError(error);

        expect(logServiceSpy.log).toHaveBeenCalledWith({
            message: 'Erro desconhecido',
            stack: '',
            url: window.location.href,
            timestamp: jasmine.any(String),
        });
        expect(ngZoneSpy.run).toHaveBeenCalled();
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Ocorreu um erro inesperado. Nossa equipe foi notificada, tente novamente mais tarde.',
        );
    });
});
