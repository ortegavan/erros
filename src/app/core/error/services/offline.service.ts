import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
    HttpClient,
    HttpContext,
    HttpContextToken,
} from '@angular/common/http';
import {
    catchError,
    filter,
    map,
    Observable,
    of,
    Subscription,
    switchMap,
    tap,
    timer,
} from 'rxjs';
import { Error } from '../models/error';

export const IGNORE_ERROR_INTERCEPTOR = new HttpContextToken(() => false);

@Injectable({
    providedIn: 'root',
})
export class OfflineService {
    private readonly storageKey = 'offline_logs';
    private readonly pingUrl = `${environment.apiUrl}/v1/health`;
    private readonly syncUrl = `${environment.apiUrl}/v1/errorLog/bulk`;
    private readonly syncInterval = 10000;
    private http = inject(HttpClient);
    private syncSubscription?: Subscription;

    log(error: Error): void {
        const stored = this.getStoredLogs();
        stored.push(error);
        localStorage.setItem(this.storageKey, JSON.stringify(stored));

        if (!this.syncSubscription || this.syncSubscription.closed) {
            this.startSyncLoop();
        }
    }

    private getStoredLogs(): Error[] {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : [];
    }

    private clearStoredLogs(): void {
        localStorage.removeItem(this.storageKey);
    }

    private startSyncLoop(): void {
        this.syncSubscription = timer(0, this.syncInterval)
            .pipe(
                switchMap(() => this.pingServer()),
                filter((isOnline) => isOnline),
                switchMap(() => this.syncLogs()),
                tap(() => this.stopSyncLoop()),
                catchError(() => of(null)),
            )
            .subscribe();
    }

    private stopSyncLoop(): void {
        this.syncSubscription?.unsubscribe();
        this.syncSubscription = undefined;
    }

    private pingServer(): Observable<boolean> {
        return this.http
            .get(this.pingUrl, {
                responseType: 'text',
                context: new HttpContext().set(IGNORE_ERROR_INTERCEPTOR, true),
            })
            .pipe(
                map(() => true),
                catchError(() => of(false)),
            );
    }

    private syncLogs(): Observable<any> {
        const logs = this.getStoredLogs();
        if (logs.length === 0) return of(null);

        return this.http
            .post(this.syncUrl, logs)
            .pipe(tap(() => this.clearStoredLogs()));
    }
}
