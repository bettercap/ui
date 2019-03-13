import {Component, OnInit, OnDestroy} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { ApiService } from '../../services/api.service';
import { Host } from '../../models/host';

import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-lan-table',
    templateUrl: './lan-table.component.html',
    styleUrls: ['./lan-table.component.scss']
})
export class LanTableComponent implements OnInit, OnDestroy {
    hosts: Host[];
    iface: Host;
    gateway: Host;
    sort: ColumnSortedEvent;
    sortSub: any;

    visibleMeta = {};

    faInfoCircle = faInfoCircle;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'ipv4', type:'ip', direction: 'desc'};
        this.update(this.api.session);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.hosts, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    private update(session) {
        this.iface = session.interface;
        this.gateway = session.gateway;
        this.hosts = session.lan['hosts']; 
        this.sortService.sort(this.hosts, this.sort)
    }
}
