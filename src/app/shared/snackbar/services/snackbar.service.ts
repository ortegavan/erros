import { Injectable, signal } from '@angular/core';
import { SnackbarMessage } from '../models/snackbar-message';
import { SnackbarType } from '../models/snackbar-type';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    private nextId = 0;
    messages = signal<SnackbarMessage[]>([]);

    show(
        message: string,
        type: SnackbarType = { type: 'success', icon: 'ok.svg' },
        duration: number = 3000,
    ): void {
        const snackMessage: SnackbarMessage = {
            message,
            type,
            duration,
            id: this.nextId++,
        };

        this.messages.update((messages) => [...messages, snackMessage]);

        if (duration > 0) {
            setTimeout(() => {
                this.removeMessage(snackMessage.id);
            }, duration);
        }
    }

    removeMessage(id: number): void {
        this.messages.update((messages) =>
            messages.filter((msg) => msg.id !== id),
        );
    }

    success(message: string, duration: number = 3000): void {
        const type = {
            type: 'success',
            icon: 'ok.svg',
        } as SnackbarType;
        this.show(message, type, duration);
    }

    error(message: string, duration: number = 5000): void {
        const type = {
            type: 'error',
            icon: 'error.svg',
        } as SnackbarType;
        this.show(message, type, duration);
    }

    warning(message: string, duration: number = 4000): void {
        const type = {
            type: 'warning',
            icon: 'warning.svg',
        } as SnackbarType;
        this.show(message, type, duration);
    }

    info(message: string, duration: number = 4000): void {
        const type = {
            type: 'info',
            icon: 'info.svg',
        } as SnackbarType;
        this.show(message, type, duration);
    }
}
