import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './../login/auth.service';
import { ApplicationRole } from '../login/application-role.enum';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.isAdmin();
    }

    private isAdmin(): boolean {
        if (this.authService.isAuthenticated()) {
            const admin = this.authService.isInRole(ApplicationRole.Admin);

            if (admin) {
                return true;
            }
        }

        // Navigate to the login page with extras
        this.router.navigate(['/home']);
        return false;
    }
}
