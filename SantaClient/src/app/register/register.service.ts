import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RegisterViewModel } from './register-view-model';
import { Observe } from '../login/observe.enum';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private static readonly registerUrl =
        'https://localhost:44302/api/register';
    private static readonly observeType = Observe.response;
    private static readonly registerSuccessMsg = 'register success';

    constructor(private http: HttpClient) {}

    register(user: RegisterViewModel): Observable<string> {
        return this.http
            .post(RegisterService.registerUrl, user, {
                observe: RegisterService.observeType
            })
            .pipe(
                map(res => RegisterService.registerSuccessMsg), // pass back a success message
                catchError(this.handleError) // handle error
            );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMsg = 'Invalid register model';
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else if (typeof error.error.error === 'string') {
            const emailError = error.error.error.startsWith('Email');
            const emailErrorMsg = 'An account with that email already exists';
            const userNameErrorMsg = 'An account with that Username already exists';
            errorMsg = emailError ? emailErrorMsg : userNameErrorMsg;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMsg = 'Something went wrong. Please try again';
            console.error('Invalid register model');
        }
        // return an observable with a user-facing error message
        return throwError(errorMsg);
    }
}
