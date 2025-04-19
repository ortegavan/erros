import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import type { Error } from '../models/error';

describe('LogService', () => {
    let service: LogService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('HttpClient', ['post']);

        TestBed.configureTestingModule({
            providers: [LogService, { provide: HttpClient, useValue: spy }],
        });

        service = TestBed.inject(LogService);
        httpClientSpy = TestBed.inject(
            HttpClient,
        ) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should log error to the server', () => {
        const error: Error = {
            message: 'Test error',
            timestamp: new Date().toISOString(),
            stack: 'Test stack',
            url: '/test',
        };

        httpClientSpy.post.and.returnValue(of({}));

        service.log(error);

        expect(httpClientSpy.post).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/v1\/errorlog$/),
            error,
        );
    });
});
