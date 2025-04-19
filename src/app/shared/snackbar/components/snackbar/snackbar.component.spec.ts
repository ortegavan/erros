import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar.component';
import { SnackbarService } from '../../services/snackbar.service';
import { signal } from '@angular/core';

describe('SnackbarComponent', () => {
    let component: SnackbarComponent;
    let fixture: ComponentFixture<SnackbarComponent>;
    let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('SnackbarService', ['removeMessage']);
        spy.messages = signal([]);

        await TestBed.configureTestingModule({
            imports: [SnackbarComponent],
            providers: [{ provide: SnackbarService, useValue: spy }],
        }).compileComponents();

        fixture = TestBed.createComponent(SnackbarComponent);
        component = fixture.componentInstance;
        snackbarServiceSpy = TestBed.inject(
            SnackbarService,
        ) as jasmine.SpyObj<SnackbarService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with messages from service', () => {
        expect(component.messages).toBe(snackbarServiceSpy.messages);
    });

    it('should call removeMessage on service when removing a message', () => {
        const messageId = 123;
        component.removeMessage(messageId);
        expect(snackbarServiceSpy.removeMessage).toHaveBeenCalledWith(
            messageId,
        );
    });
});
