import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { AuthService } from './../login/auth.service';
import { ApplicationUser } from './application-user';
import { Observe } from '../login/observe.enum';

@Injectable({
    providedIn: 'root'
})
export class SantaListService {
    private static readonly getChildrenUrl =
        'https://localhost:44302/api/children';
    private static readonly deleteChildUrlBase = 'https://localhost:44302/api/children';
    private static readonly observeType = Observe.body;
    private static readonly invalidTokenMsg = 'invalid token';
    private static readonly deleteChildSuccessMsg = 'delete child success';
    constructor(private http: HttpClient, private authService: AuthService) {}

    getChildren(): Observable<ApplicationUser[]> {
        const token = this.authService.getAuthorizationToken();

        // valid token not found
        if (!token) {
            throw new Error(SantaListService.invalidTokenMsg);
        }

        return this.http
            .get<ApplicationUser[]>(SantaListService.getChildrenUrl, {
                observe: SantaListService.observeType,
                headers: new HttpHeaders({
                    Authorization: `Bearer ${token}`
                })
            })
            .pipe(
                catchError(this.handleError) // handle error
            );
    }

    deleteChild(id: string): Observable<string> {
        const token = this.authService.getAuthorizationToken();

        // valid token not found
        if (!token) {
            throw new Error(SantaListService.invalidTokenMsg);
        }

        const url = `${SantaListService.deleteChildUrlBase}/${id}`;

        return this.http
            .delete(url, {
                observe: SantaListService.observeType,
                headers: new HttpHeaders({
                    Authorization: `Bearer ${token}`
                }),
                params: new HttpParams().set('id', id)
            })
            .pipe(
                map(res => SantaListService.deleteChildSuccessMsg),
                catchError(this.handleError) // handle error
            );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMsg = 'Failed to get Santa list.';
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else if (typeof error.error.error === 'string') {
            errorMsg = 'You are unauthorized to access Santa list';
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
