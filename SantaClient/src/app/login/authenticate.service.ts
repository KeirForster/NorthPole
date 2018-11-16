import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LoginViewModel } from './login-view-model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {
    private static readonly authenticateUrl = 'https://localhost:44302/login';

    constructor(private http: HttpClient) {}

    /**
     * POST
     * authenticate the user on the server.
     *
     * @return an `Observable` of the type `string` for the request.
     */
    authenticate(user: LoginViewModel): Observable<string> {
        return this.http
            .post(AuthenticateService.authenticateUrl, user, {
                observe: 'response'
            })
            .pipe(
                tap(res => this.setAuthorizationToken(res.body)),
                map(res => user.email), // pass back the user email
                catchError(this.handleError) // handle error
            );
    }

    getAuthorizationToken(): string {
        return localStorage.getItem('token');
    }

    private setAuthorizationToken(body: any): void {
        localStorage.setItem('token', body.token);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error('Incorrect Email or Password');
        }
        // return an observable with a user-facing error message
        return throwError('Incorrect Email or Password');
    }
}
