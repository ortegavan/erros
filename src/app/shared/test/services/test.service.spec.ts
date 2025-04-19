import { TestBed } from '@angular/core/testing';
import { TestService } from './test.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('TestService', () => {
    let service: TestService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('HttpClient', ['get']);

        TestBed.configureTestingModule({
            providers: [TestService, { provide: HttpClient, useValue: spy }],
        });

        service = TestBed.inject(TestService);
        httpClientSpy = TestBed.inject(
            HttpClient,
        ) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should make HTTP request for 401 error', () => {
        httpClientSpy.get.and.returnValue(of({}));
        service.get401().subscribe();
        expect(httpClientSpy.get).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/v1\/test\/401$/),
        );
    });

    it('should make HTTP request for 403 error', () => {
        httpClientSpy.get.and.returnValue(of({}));
        service.get403().subscribe();
        expect(httpClientSpy.get).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/v1\/test\/403$/),
        );
    });

    it('should make HTTP request for 404 error', () => {
        httpClientSpy.get.and.returnValue(of({}));
        service.get404().subscribe();
        expect(httpClientSpy.get).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/v1\/test\/404$/),
        );
    });

    it('should make HTTP request for 500 error', () => {
        httpClientSpy.get.and.returnValue(of({}));
        service.get500().subscribe();
        expect(httpClientSpy.get).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/v1\/test\/500$/),
        );
    });

    it('should throw non-HTTP error', () => {
        expect(() => service.getNonHttpError()).toThrowError('Non HTTP error');
    });
});
