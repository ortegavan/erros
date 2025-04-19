import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';
import { SnackbarType } from '../models/snackbar-type';

describe('SnackbarService', () => {
    let service: SnackbarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SnackbarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add a message when show is called', () => {
        const message = 'Test message';
        const type: SnackbarType = { type: 'success', icon: 'ok.svg' };
        const duration = 3000;

        service.show(message, type, duration);

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].message).toBe(message);
        expect(service.messages()[0].type).toEqual(type);
        expect(service.messages()[0].duration).toBe(duration);
    });

    it('should remove a message when removeMessage is called', () => {
        const message = 'Test message';
        service.show(message);

        const messageId = service.messages()[0].id;
        service.removeMessage(messageId);

        expect(service.messages().length).toBe(0);
    });

    it('should show success message with correct type and duration', () => {
        const message = 'Success message';
        const duration = 2000;

        service.success(message, duration);

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].message).toBe(message);
        expect(service.messages()[0].type).toEqual({
            type: 'success',
            icon: 'ok.svg',
        });
        expect(service.messages()[0].duration).toBe(duration);
    });

    it('should show error message with correct type and duration', () => {
        const message = 'Error message';
        const duration = 4000;

        service.error(message, duration);

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].message).toBe(message);
        expect(service.messages()[0].type).toEqual({
            type: 'error',
            icon: 'error.svg',
        });
        expect(service.messages()[0].duration).toBe(duration);
    });

    it('should show warning message with correct type and duration', () => {
        const message = 'Warning message';
        const duration = 3500;

        service.warning(message, duration);

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].message).toBe(message);
        expect(service.messages()[0].type).toEqual({
            type: 'warning',
            icon: 'warning.svg',
        });
        expect(service.messages()[0].duration).toBe(duration);
    });

    it('should show info message with correct type and duration', () => {
        const message = 'Info message';
        const duration = 2500;

        service.info(message, duration);

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].message).toBe(message);
        expect(service.messages()[0].type).toEqual({
            type: 'info',
            icon: 'info.svg',
        });
        expect(service.messages()[0].duration).toBe(duration);
    });

    it('should automatically remove message after duration', (done) => {
        const message = 'Auto remove message';
        const duration = 100;

        service.show(message, { type: 'success', icon: 'ok.svg' }, duration);

        setTimeout(() => {
            expect(service.messages().length).toBe(0);
            done();
        }, duration + 50);
    });

    it('should not automatically remove message when duration is 0', (done) => {
        const message = 'No auto remove message';
        const duration = 0;

        service.show(message, { type: 'success', icon: 'ok.svg' }, duration);

        setTimeout(() => {
            expect(service.messages().length).toBe(1);
            done();
        }, 100);
    });
});
