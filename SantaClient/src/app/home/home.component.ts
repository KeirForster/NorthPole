import { Component, OnInit } from '@angular/core';

import { ApplicationRole } from '../login/application-role.enum';
import { AuthService } from './../login/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    username: string;

    constructor(private authService: AuthService) {
        this.username = this.authService.getSubject();
    }

    ngOnInit() {}

    isAdmin() {
        this.authService.isInRole(ApplicationRole.Admin);
    }
}
