import { Subscription } from 'rxjs';
import { ApplicationUser } from './application-user';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';

import { ApplicationRole } from '../login/application-role.enum';
import { AuthService } from './../login/auth.service';
import {
    faPlus,
    faTrash,
    faPencilAlt,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import { SantaListService } from './santa-list.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private static readonly modalConfig = {
        backdrop: true,
        ignoreBackdropClick: true
    };
    readonly username: string;
    readonly admin: boolean;
    readonly faPlus;
    readonly faTrash;
    readonly faPencilAlt;
    readonly faSync;
    children: ApplicationUser[];
    getChildrenError: string;
    deleteChildError: string;
    modalRef: BsModalRef;
    processingDelete: boolean;
    private santaSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private santaService: SantaListService,
        private modalService: BsModalService
    ) {
        this.username = this.authService.getSubject();
        this.admin = this.authService.isInRole(ApplicationRole.Admin);
        this.faPlus = faPlus;
        this.faTrash = faTrash;
        this.faSync = faSync;
        this.faPencilAlt = faPencilAlt;
        this.processingDelete = false;
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(
            template,
            HomeComponent.modalConfig
        );
    }

    deleteChild(child: ApplicationUser): void {
        this.processingDelete = true;
        this.santaSubscription = this.santaService
            .deleteChild(child.id)
            .subscribe(
                (res: string) => {
                    this.removeChildFromArray(child);
                    this.processingDelete = false;
                    this.modalRef.hide();
                },
                error => {
                    this.processingDelete = false;
                    this.deleteChildError = error;
                }
            );
    }

    private removeChildFromArray(child: ApplicationUser): void {
        const childIndex = this.children.findIndex((elem, index) => {
            return elem.id === child.id;
        });

        if (childIndex) {
            this.children.splice(childIndex, 1);
        }
    }
}
