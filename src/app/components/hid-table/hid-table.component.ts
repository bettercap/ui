import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {HIDDevice} from '../../models/hid.device';

import {faCheckCircle, faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-hid-table',
    templateUrl: './hid-table.component.html',
    styleUrls: ['./hid-table.component.scss']
})
export class HidTableComponent implements OnInit {
    devices: HIDDevice[];

    faCheckCircle = faCheckCircle;
    faTimes = faTimes;

    constructor(private api: ApiService) { 
        this.update(this.api.session.hid['devices']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.hid['devices']);
        });
    }

    private update(devices) {
        this.devices = devices; 
        this.devices.sort((a,b) => (a.address < b.address) ? 1 : (a.address > b.address) ? -1 : 0);
    }
}
