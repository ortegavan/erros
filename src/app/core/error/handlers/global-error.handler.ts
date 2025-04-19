import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { LogService } from '../services/log.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private notificationService = inject(NotificationService);
    private logService = inject(LogService);
    private ngZone = inject(NgZone);

    handleError(error: unknown): void {
        if (error instanceof HttpErrorResponse) {
            return;
        }

        const message = this.getErrorMessage(error);
        const stackTrace = this.getErrorStack(error);

        this.logService.log({
            message,
            stack: stackTrace,
            url: window.location.href,
            timestamp: new Date().toISOString(),
        });

        this.ngZone.run(() => {
            this.notificationService.showError(
                'Ocorreu um erro inesperado. Nossa equipe foi notificada, tente novamente mais tarde.',
            );
        });
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        } else if (typeof error === 'string') {
            return error;
        } else {
            return 'Erro desconhecido';
        }
    }

    private getErrorStack(error: unknown): string {
        if (error instanceof Error) {
            return error.stack || '';
        }
        return '';
    }
}
