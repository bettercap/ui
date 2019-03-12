import {Component, OnInit} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Host } from '../../models/host';

import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-lan-table',
    templateUrl: './lan-table.component.html',
    styleUrls: ['./lan-table.component.scss']
})
export class LanTableComponent implements OnInit {
    hosts: Host[];
    visibleMeta = {};

    faInfoCircle = faInfoCircle;

    constructor(private api: ApiService) { 
        this.update(this.api.session.lan['hosts']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.lan['hosts']);
        });
    }

    private update(hosts) {
        this.hosts = hosts; 
        this.hosts.sort((a,b) => (a.ipv4 < b.ipv4) ? -1 : (a.ipv4 > b.ipv4) ? 1 : 0);
    }
}
