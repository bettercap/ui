import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { ApiService } from '../../services/api.service';

import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {faBluetoothB} from '@fortawesome/free-brands-svg-icons/faBluetoothB';
import {faTerminal} from '@fortawesome/free-solid-svg-icons/faTerminal';

@Component({
    selector: 'hydra-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
    faSignOutAlt = faSignOutAlt;

    numHosts = 0;
    numAps = 0;
    numBLE = 0;
    numHID = 0;

    error: any;

    constructor(private api: ApiService, private router: Router) { 
        this.update(this.api.session);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });

        this.api.onError.subscribe(error => {
            this.error = error;
        });
    }

    private update(session) {
        this.numHosts = session.lan['hosts'].length; 
        this.numAps = session.wifi['aps'].length; 
        this.numBLE = session.ble['devices'].length; 
        this.numHID = session.hid['devices'].length; 
    }

    logout() {
        this.api.logout();
        this.router.navigateByUrl("/login");
    }
}
