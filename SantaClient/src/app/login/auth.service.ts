import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApplicationRole } from './application-role';
import { LoginViewModel } from './login-view-model';
import { Observe } from './observe.enum';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private static readonly authenticateUrl =
        'https://localhost:44302/api/login';
    private static readonly observeType = Observe.response;
    private static readonly tokenName = 'token';
    private static readonly invalidTokenMsg = 'invalid token';
    private static readonly authSuccessMsg = 'login success';
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
                observe: AuthService.observeType
            })
            .pipe(
                tap(res => {
                    this.setAuthorizationToken(res.body); // store token
                    // assign instance variables
                    this.setApplicationUserAttributes(
                        this.getAuthorizationToken()
                    );
                }),
                map(res => AuthService.authSuccessMsg), // pass back a success message
                catchError(this.handleError) // handle error
            );
    }

    logout(): void {
        localStorage.removeItem(AuthService.tokenName);
        this.subject = undefined;
        this.expiration = undefined;
        this.roles = undefined;
        this.authenticated = false;
        this.authenticationStatus.next(false);
    }

    getAuthorizationToken(): string | null {
        const token = localStorage.getItem(AuthService.tokenName);
        if (token) {
            return token;
        }
        return null;
    }

    getSubject(): string | null {
        if (this.isAuthenticated()) {
            return this.subject;
        }
        return null;
    }

    isExpired(): boolean {
        if (this.isAuthenticated()) {
            return this.tokenIsExpired();
        }
        return true;
    }

    getRoles(): ApplicationRole[] | null {
        if (this.isAuthenticated()) {
            return this.roles;
        }
        return null;
    }

    isInRole(roleName: ApplicationRole): boolean {
        if (this.isAuthenticated()) {
            return this.roles.includes(roleName);
        }
        return false;
    }

    isAuthenticated(): boolean {
        if (this.authenticated) {
            return true;
        }

        // not authenticated (user potentially refreshed the browser)
        // attempt to retrieve stored token
        const token = this.getAuthorizationToken();

        if (this.tokenIsValid(token)) {
            // update instance variables
            this.setApplicationUserAttributes(token);
            return this.authenticated;
        } else {
            // no valid token found
            return false;
        }
    }

    private setAuthorizationToken(responseBody: any): void {
        localStorage.removeItem(AuthService.tokenName);
        localStorage.setItem(AuthService.tokenName, responseBody.token);
    }

    private tokenIsValid(token: string): boolean {
        if (token && token.length) {
            return true;
        }
        return false;
    }

    private tokenIsExpired(): boolean {
        const now = new Date();
        const nowMilli = now.getTime();
        const expMilli = this.expiration.getTime();
        return expMilli - nowMilli < 0;
    }

    private setApplicationUserAttributes(token: string): void {
        if (this.tokenIsValid(token)) {
            // decode token
            const payloadBase64Url = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64Url));

            this.subject = payload.sub; // username

            const exp = new Date(0); // begining of UTC converted to current timezone
            exp.setUTCSeconds(payload.exp); // add number of seconds to expiration
            this.expiration = exp;

            this.roles = payload.roles.split(','); // Admin, Child, etc
            this.authenticated = true; // user is authenticated
            this.authenticationStatus.next(true); // broadcast authentication status
        } else {
            throw new Error(AuthService.invalidTokenMsg);
        }
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
