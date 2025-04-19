import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { LogService } from '../services/log.service';
import { catchError, EMPTY, retry, throwError, timer } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const notificationService = inject(NotificationService);
    const logService = inject(LogService);

    return next(req).pipe(
        retry({
            count: 2,
            delay: (error: HttpErrorResponse) => {
                if (error.status === 500) {
                    return timer(1000);
                }
                return throwError(() => error);
            },
        }),
        catchError((error: HttpErrorResponse) => {
            if (!navigator.onLine) {
                notificationService.showError(
                    'Você está offline. Verifique sua conexão e tente novamente.',
                );
                return EMPTY;
            }

            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 0:
                        // TODO: Handle network error
                        break;

                    case 401:
                        notificationService.showWarning(
                            'Sua sessão expirou. Faça login novamente.',
                        );
                        router.navigate(['/login']);
                        break;

                    case 403:
                        notificationService.showWarning(
                            'Você não tem permissão para acessar este recurso',
                        );
                        break;

                    case 404:
                        notificationService.showInfo(
                            'O recurso solicitado não foi encontrado',
                        );
                        break;

                    case 500:
                        logService.log({
                            message: error.message,
                            stack: error.error?.stack || 'No stack trace',
                            url: req.url,
                            status: error.status,
                            timestamp: new Date().toISOString(),
                        });

                        notificationService.showError(
                            'Ocorreu um erro no servidor. Tente novamente em alguns minutos.',
                        );
                        break;

                    default:
                        notificationService.showError(
                            `Ocorreu um erro: ${error.message}`,
                        );
                        break;
                }
            }

            return EMPTY;
        }),
    );
};
