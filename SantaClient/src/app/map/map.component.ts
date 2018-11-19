import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { ApplicationUser } from './../home/application-user';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { SantaListService } from '../home/santa-list.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
    readonly faAngleLeft: any;
    private santaSubscription: Subscription;
    lat = 40.730610;
    lng = -73.935242;

    constructor(
        private santaService: SantaListService,
        private route: ActivatedRoute
    ) {
        this.faAngleLeft = faAngleLeft;
    }

    ngOnInit() {
        this.santaSubscription = this.santaService
            .getChild(this.route.snapshot.params.id)
            .subscribe(
                (child: ApplicationUser) => {
                    this.lat = child.latitude;
                    this.lng = child.longitude;
                    console.log(child);
                },
                error => {
                    console.error(error);
                }
            );
    }

    ngOnDestroy(): void {
        if (this.santaSubscription) {
            this.santaSubscription.unsubscribe();
        }
    }
}
