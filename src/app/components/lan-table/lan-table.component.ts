import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { ApiService } from '../../services/api.service';
import { Host } from '../../models/host';
import { OmnibarComponent } from '../omnibar/omnibar.component';

import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
    selector: 'hydra-lan-table',
    templateUrl: './lan-table.component.html',
    styleUrls: ['./lan-table.component.scss']
})
export class LanTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    hosts: Host[] = [];
    scanState: any = {
        scanning: [],
        progress: 0.0
    };

    iface: Host;
    gateway: Host;
    sort: ColumnSortedEvent;
    sortSub: any;

    visibleMeta = null;
    visibleMenu = null;

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
        this.scanState = this.api.module('syn.scan').state;

        if( $('.menu-dropdown').is(':visible') )
            return;

        this.iface = session.interface;
        this.gateway = session.gateway;
        this.hosts = [];

        // if we `this.hosts` = session.lan['hosts'], pushing
        // to this.hosts will also push to the session object
        // duplicating the iface and gateway.
        for( var i = 0; i < session.lan['hosts'].length; i++ ){
            let host = session.lan['hosts'][i];
            // get traffic details for this host
            let sent = 0, received = 0;
            if( host.ipv4 in session.packets.traffic ) {
                let traffic = session.packets.traffic[host.ipv4];
                sent = traffic.sent;
                received = traffic.received;
            }

            host.sent = sent;
            host.received = received;

            this.hosts.push(host); 
        }
        this.hosts.push(this.iface);
        this.hosts.push(this.gateway);

        this.sortService.sort(this.hosts, this.sort)
    }

    setAlias(host) {
        let alias = prompt("Set an alias for this host:", host.alias);
        if( alias === null )
            return;

        if( alias.trim() == "" )
            alias = '""';

        this.api.cmd("alias " + host.mac + " " + alias);
    }

    showScannerModal(host) {
        $('#scanIP').val(host.ipv4);
        $('#startPort').val('1');
        $('#endPort').val('10000');
        $('#scannerModal').modal('show');
    }

    doPortScan() {
        let ip = $('#scanIP').val();
        let startPort = $('#startPort').val();
        let endPort = $('#endPort').val();
        $('#scannerModal').modal('hide');

        this.api.cmd("syn.scan " + ip +" " + startPort + " " + endPort);
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
