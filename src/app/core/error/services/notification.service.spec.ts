import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { SnackbarService } from '@snackbar/services/snackbar.service';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('SnackbarService', [
            'success',
            'info',
            'warning',
            'error',
        ]);

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: SnackbarService, useValue: spy },
            ],
        });

        service = TestBed.inject(NotificationService);
        snackbarServiceSpy = TestBed.inject(
            SnackbarService,
        ) as jasmine.SpyObj<SnackbarService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show success message', () => {
        const message = 'Success message';
        service.showSuccess(message);
        expect(snackbarServiceSpy.success).toHaveBeenCalledWith(message);
    });

    it('should show info message', () => {
        const message = 'Info message';
        service.showInfo(message);
        expect(snackbarServiceSpy.info).toHaveBeenCalledWith(message);
    });

    it('should show warning message', () => {
        const message = 'Warning message';
        service.showWarning(message);
        expect(snackbarServiceSpy.warning).toHaveBeenCalledWith(message);
    });

    it('should show error message', () => {
        const message = 'Error message';
        service.showError(message);
        expect(snackbarServiceSpy.error).toHaveBeenCalledWith(message);
    });
});
