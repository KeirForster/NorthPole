import { Component, OnInit } from '@angular/core';

import { ApplicationRole } from './../login/application-role';
import { AuthService } from './../login/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    username: string;
    admin: boolean;

    constructor(private authService: AuthService) {
        this.username = this.authService.getSubject();
        this.admin = this.authService.isInRole(ApplicationRole.Admin);
    }

    ngOnInit() {}
}
