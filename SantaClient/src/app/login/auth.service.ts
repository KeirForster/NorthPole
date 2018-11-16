import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApplicationRole } from './application-role';
import { LoginViewModel } from './login-view-model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private static readonly authenticateUrl = 'https://localhost:44302/login';

    private subject: string;
    private expiration: Date;
    private roles: ApplicationRole[];

    constructor(private http: HttpClient) {}

    /**
     * Authenticate a user on the server.
     *
     * @param user a user to authenticate
     * @return an `Observable` of type `string` with a response message.
     */
    authenticate(user: LoginViewModel): Observable<string> {
        return this.http
            .post(AuthService.authenticateUrl, user, {
                observe: 'response'
            })
            .pipe(
                tap(res => this.setAuthorizationToken(res.body)), // store id token
                map(res => 'login success'), // pass back a success message
                catchError(this.handleError) // handle error
            );
    }

    getAuthorizationToken(): string {
        return localStorage.getItem('token');
    }

    getSubject(): string {
        return this.subject;
    }

    getRoles(): ApplicationRole[] {
        return this.roles;
    }

    isExpired(): boolean {
        const now = new Date();
        const nowMilli = now.getTime();
        const expMilli =  this.expiration.getTime();
        return expMilli - nowMilli < 0;
    }

    private setAuthorizationToken(body: any): void {
        localStorage.removeItem('token');
        localStorage.setItem('token', body.token);
        this.setApplicationUser(body.token);
    }

    private setApplicationUser(token: string): void {
        const payloadBase64Url = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64Url));
        this.subject = payload.sub;
        this.roles = payload.roles.split(',');

        const exp = new Date(0); // begining of UTC converted to current timezone
        exp.setUTCSeconds(payload.exp); // add number of seconds to expiration
        this.expiration = exp;
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
