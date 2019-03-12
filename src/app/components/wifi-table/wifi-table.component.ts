import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Ap} from '../../models/ap';

import {faUnlock} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-wifi-table',
    templateUrl: './wifi-table.component.html',
    styleUrls: ['./wifi-table.component.scss']
})
export class WifiTableComponent implements OnInit {
    aps: Ap[];
    visibleWPS = {};
    visibleClients = {};

    faUnlock = faUnlock;

    constructor(private api: ApiService) { 
        this.update(this.api.session.wifi['aps']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.wifi['aps']);
        });
    }

    private update(aps) {
        this.aps = aps; 
        this.aps.sort((a,b) => (a.rssi < b.rssi) ? 1 : (a.rssi > b.rssi) ? -1 : 0);
    }
}
