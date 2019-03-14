import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { ApiService } from '../../services/api.service';
import { Host } from '../../models/host';
import { OmnibarComponent } from '../omnibar/omnibar.component';

import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-lan-table',
    templateUrl: './lan-table.component.html',
    styleUrls: ['./lan-table.component.scss']
})
export class LanTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

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
        this.hosts = [];

        // if we `this.hosts` = session.lan['hosts'], pushing
        // to this.hosts will also push to the session object
        // duplicating the iface and gateway.
        for( var i = 0; i < session.lan['hosts'].length; i++ ){
            this.hosts.push(session.lan['hosts'][i]); 
        }
        this.hosts.push(this.iface);
        this.hosts.push(this.gateway);

        this.sortService.sort(this.hosts, this.sort)
    }

    groupMetas(metas) {
        let grouped = {};
        for( let name in metas ) {
            let parts = name.split(':'),
                group = parts[0].toUpperCase(),
                sub = parts[1];

            if( group in grouped ) {
                grouped[group][sub] = metas[name];
            } else {
                grouped[group] = {};
                grouped[group][sub] = metas[name];
            }
        }
        // console.log("grouped", grouped);
        return grouped;
    }
}
