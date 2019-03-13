import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { ApiService } from '../../services/api.service';

import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
    faSignOutAlt = faSignOutAlt;

    numEvents = 0;
    numHosts = 0;
    numAps = 0;
    numBLE = 0;
    numHID = 0;

    error: any;

    constructor(private api: ApiService, private router: Router) { 
        this.updateSession(this.api.session);
        this.updateEvents(this.api.events);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.updateSession(session);
        });

        this.api.onNewEvents.subscribe(events => {
            this.updateEvents(events);
        });

        this.api.onError.subscribe(error => {
            this.error = error;
        });
    }

    private updateSession(session) {
        this.numHosts = session.lan['hosts'].length; 
        this.numAps = session.wifi['aps'].length; 
        this.numBLE = session.ble['devices'].length; 
        this.numHID = session.hid['devices'].length; 
    }

    private updateEvents(events) {
        this.numEvents = events.length
    }

    logout() {
        this.api.logout();
        this.router.navigateByUrl("/login");
    }
}
