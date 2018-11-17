import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
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
    private authenticated: boolean;
    readonly authenticationStatus: Subject<boolean>;

    constructor(private http: HttpClient) {
        this.authenticated = false;
        this.authenticationStatus = new Subject<boolean>();
    }

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
                tap(res => {
                    this.setAuthorizationToken(res.body); // store id token
                    this.authenticated = true; // update current auth status
                    this.authenticationStatus.next(true); // broadcast auth status
                }),
                map(res => 'login success'), // pass back a success message
                catchError(this.handleError) // handle error
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.authenticated = false;
        this.authenticationStatus.next(false);
        this.subject = undefined;
        this.expiration = undefined;
        this.roles = undefined;
    }

    getAuthorizationToken(): string | null {
        if (this.authenticated) {
            return localStorage.getItem('token');
        }
        return null;
    }

    getSubject(): string | null {
        if (this.authenticated) {
            return this.subject;
        }
        return null;
    }

    getRoles(): ApplicationRole[] | null {
        if (this.authenticated) {
            return this.roles;
        }
        return null;
    }

    isExpired(): boolean {
        if (this.authenticated) {
            const now = new Date();
            const nowMilli = now.getTime();
            const expMilli = this.expiration.getTime();
            return expMilli - nowMilli < 0;
        }
        return true;
    }

    isAuthenticated(): boolean {
        return this.authenticated;
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
