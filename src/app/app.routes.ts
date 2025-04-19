import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./shared/test/components/login/login.component').then(
                (m) => m.LoginComponent,
            ),
    },
];
