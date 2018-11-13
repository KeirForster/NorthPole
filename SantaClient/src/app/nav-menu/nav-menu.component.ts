import { Component, OnInit } from '@angular/core';
import { faUserPlus, faSignInAlt, faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
    faUserPlus = faUserPlus;
    faSignInAlt = faSignInAlt;
    faHome = faHome;
    isExpanded = false;
    constructor() {}

    ngOnInit() {}

    collapse() {
      this.isExpanded = false;
    }

    toggle() {
      this.isExpanded = !this.isExpanded;
    }
}
