import { inject, Injectable } from '@angular/core';
import { SnackbarService } from '@snackbar/services/snackbar.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private snackbarService = inject(SnackbarService);

    showSuccess(message: string): void {
        this.snackbarService.success(message);
    }

    showInfo(message: string): void {
        this.snackbarService.info(message);
    }

    showWarning(message: string): void {
        this.snackbarService.warning(message);
    }

    showError(message: string): void {
        this.snackbarService.error(message);
    }
}
