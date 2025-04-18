import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from '@snackbar/components/snackbar/snackbar.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SnackbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
