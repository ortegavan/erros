import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TestService {
    private http = inject(HttpClient);

    get401() {
        return this.http.get(`${environment.apiUrl}/v1/test/401`);
    }

    get403() {
        return this.http.get(`${environment.apiUrl}/v1/test/403`);
    }

    get404() {
        return this.http.get(`${environment.apiUrl}/v1/test/404`);
    }

    get500() {
        return this.http.get(`${environment.apiUrl}/v1/test/500`);
    }

    getNonHttpError() {
        throw new Error('Non HTTP error');
    }
}
