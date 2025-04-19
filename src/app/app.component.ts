import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from '@snackbar/components/snackbar/snackbar.component';
import { TestService } from './shared/test/services/test.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SnackbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    testService = inject(TestService);

    test401() {
        this.testService.get401().subscribe();
    }

    test403() {
        this.testService.get403().subscribe();
    }

    test404() {
        this.testService.get404().subscribe();
    }

    test500() {
        this.testService.get500().subscribe();
    }

    testNonHttpError() {
        this.testService.getNonHttpError();
    }
}
