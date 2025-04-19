import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestService } from './shared/test/services/test.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let testServiceSpy: jasmine.SpyObj<TestService>;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('TestService', [
            'get401',
            'get403',
            'get404',
            'get500',
            'getNonHttpError',
        ]);

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [{ provide: TestService, useValue: spy }],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        testServiceSpy = TestBed.inject(
            TestService,
        ) as jasmine.SpyObj<TestService>;
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should call test401', () => {
        testServiceSpy.get401.and.returnValue(of({}));
        component.test401();
        expect(testServiceSpy.get401).toHaveBeenCalled();
    });

    it('should call test403', () => {
        testServiceSpy.get403.and.returnValue(of({}));
        component.test403();
        expect(testServiceSpy.get403).toHaveBeenCalled();
    });

    it('should call test404', () => {
        testServiceSpy.get404.and.returnValue(of({}));
        component.test404();
        expect(testServiceSpy.get404).toHaveBeenCalled();
    });

    it('should call test500', () => {
        testServiceSpy.get500.and.returnValue(of({}));
        component.test500();
        expect(testServiceSpy.get500).toHaveBeenCalled();
    });

    it('should call testNonHttpError', () => {
        testServiceSpy.getNonHttpError.and.throwError('Non HTTP error');
        expect(() => component.testNonHttpError()).toThrowError(
            'Non HTTP error',
        );
        expect(testServiceSpy.getNonHttpError).toHaveBeenCalled();
    });
});
