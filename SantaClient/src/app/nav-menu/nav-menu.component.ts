import { AuthService } from './../login/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    faUserPlus,
    faSignInAlt,
    faHome
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    readonly faUserPlus;
    readonly faSignInAlt;
    readonly faHome;
    isExpanded: boolean;
    authenticated: boolean;
    private authSubscription: Subscription;

    constructor(private router: Router, private authService: AuthService) {
        this.faUserPlus = faUserPlus;
        this.faSignInAlt = faSignInAlt;
        this.faHome = faHome;
        this.isExpanded = false;
    }

    ngOnInit(): void {
        // get authentication status at runtime
        this.authenticated = this.authService.isAuthenticated();

        // listen for changes to authentication status
        this.authSubscription = this.authService.authenticationStatus.subscribe(
            auth => (this.authenticated = auth)
        );
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    collapse(): void {
        this.isExpanded = false;
    }

    toggle(): void {
        this.isExpanded = !this.isExpanded;
    }
}
