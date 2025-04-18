import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Error } from '../models/error';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    private http = inject(HttpClient);
    private endpoint = `${environment.apiUrl}/v1/errorlog`;

    log(error: Error): void {
        this.http.post(this.endpoint, error).subscribe();
    }
}
