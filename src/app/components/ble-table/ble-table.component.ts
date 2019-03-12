import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Device} from '../../models/device';

import {faCheckCircle, faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-ble-table',
    templateUrl: './ble-table.component.html',
    styleUrls: ['./ble-table.component.scss']
})
export class BleTableComponent implements OnInit {
    devices: Device[];

    faCheckCircle = faCheckCircle;
    faTimes = faTimes;

    constructor(private api: ApiService) { 
        this.update(this.api.session.ble['devices']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.ble['devices']);
        });
    }

    private update(devices) {
        this.devices = devices; 
        this.devices.sort((a,b) => (a.rssi < b.rssi) ? 1 : (a.rssi > b.rssi) ? -1 : 0);
    }
}
