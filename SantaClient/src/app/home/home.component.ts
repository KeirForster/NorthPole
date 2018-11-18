import { Subscription } from 'rxjs';
import { ApplicationUser } from './application-user';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ApplicationRole } from '../login/application-role.enum';
import { AuthService } from './../login/auth.service';
import {
    faPlus,
    faTrash,
    faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { SantaListService } from './santa-list.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    readonly username: string;
    readonly admin: boolean;
    readonly faPlus;
    readonly faTrash;
    readonly faPencilAlt;
    children: ApplicationUser[];
    getChildrenError: string;
    private santaSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private santaService: SantaListService
    ) {
        this.username = this.authService.getSubject();
        this.admin = this.authService.isInRole(ApplicationRole.Admin);
        this.faPlus = faPlus;
        this.faTrash = faTrash;
        this.faPencilAlt = faPencilAlt;
    }

    ngOnInit(): void {
        if (this.admin) {
            this.santaSubscription = this.santaService.getChildren().subscribe(
                (children: ApplicationUser[]) => {
                    this.children = [...children];
                },
                error => {
                    this.getChildrenError = error;
                }
            );
        }
    }

    ngOnDestroy(): void {
        if (this.santaSubscription) {
            this.santaSubscription.unsubscribe();
        }
    }
}
