import { TestBed } from '@angular/core/testing';
import { OfflineService } from './offline.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import type { Error } from '../models/error';

describe('OfflineService', () => {
    let service: OfflineService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

        TestBed.configureTestingModule({
            providers: [OfflineService, { provide: HttpClient, useValue: spy }],
        });

        service = TestBed.inject(OfflineService);
        httpClientSpy = TestBed.inject(
            HttpClient,
        ) as jasmine.SpyObj<HttpClient>;

        // Clear localStorage before each test
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should store error logs in localStorage', () => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        service.log(error);

        const storedLogs = JSON.parse(
            localStorage.getItem('offline_logs') || '[]',
        );
        expect(storedLogs.length).toBe(1);
        expect(storedLogs[0].message).toBe(error.message);
    });

    it('should retrieve stored logs from localStorage', () => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        localStorage.setItem('offline_logs', JSON.stringify([error]));

        const storedLogs = service['getStoredLogs']();
        expect(storedLogs.length).toBe(1);
        expect(storedLogs[0].message).toBe(error.message);
    });

    it('should clear stored logs from localStorage', () => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        localStorage.setItem('offline_logs', JSON.stringify([error]));
        service['clearStoredLogs']();

        const storedLogs = JSON.parse(
            localStorage.getItem('offline_logs') || '[]',
        );
        expect(storedLogs.length).toBe(0);
    });

    it('should ping server successfully', () => {
        httpClientSpy.get.and.returnValue(of('OK'));

        service['pingServer']().subscribe((result) => {
            expect(result).toBeTrue();
            expect(httpClientSpy.get).toHaveBeenCalled();
        });
    });

    it('should handle ping server failure', () => {
        httpClientSpy.get.and.returnValue(
            throwError(() => new Error('Network error')),
        );

        service['pingServer']().subscribe((result) => {
            expect(result).toBeFalse();
            expect(httpClientSpy.get).toHaveBeenCalled();
        });
    });

    it('should sync logs successfully', () => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        localStorage.setItem('offline_logs', JSON.stringify([error]));
        httpClientSpy.post.and.returnValue(of({}));

        service['syncLogs']().subscribe(() => {
            expect(httpClientSpy.post).toHaveBeenCalled();
            const storedLogs = JSON.parse(
                localStorage.getItem('offline_logs') || '[]',
            );
            expect(storedLogs.length).toBe(0);
        });
    });

    it('should not sync when there are no logs', () => {
        httpClientSpy.post.and.returnValue(of({}));

        service['syncLogs']().subscribe(() => {
            expect(httpClientSpy.post).not.toHaveBeenCalled();
        });
    });

    it('should start sync loop when logging an error', (done) => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        httpClientSpy.get.and.returnValue(of('OK'));
        httpClientSpy.post.and.returnValue(of({}));

        service.log(error);

        // Wait for the timer to trigger
        setTimeout(() => {
            expect(httpClientSpy.get).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('should stop sync loop after successful sync', () => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        httpClientSpy.get.and.returnValue(of('OK'));
        httpClientSpy.post.and.returnValue(of({}));

        service.log(error);
        service['stopSyncLoop']();

        expect(service['syncSubscription']).toBeUndefined();
    });
});
