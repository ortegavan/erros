import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-snackbar',
    imports: [],
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
    snackbarService = inject(SnackbarService);
    cdr = inject(ChangeDetectorRef);

    messages = this.snackbarService.messages;

    removeMessage(id: number): void {
        this.snackbarService.removeMessage(id);
    }
}
