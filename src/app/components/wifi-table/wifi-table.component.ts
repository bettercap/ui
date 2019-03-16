import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {Ap} from '../../models/ap';
import { OmnibarComponent } from '../omnibar/omnibar.component';

import {faUnlock} from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
    selector: 'hydra-wifi-table',
    templateUrl: './wifi-table.component.html',
    styleUrls: ['./wifi-table.component.scss']
})
export class WifiTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    aps: Ap[];
    sort: ColumnSortedEvent;
    visibleWPS = {};
    visibleClients = {};
    visibleMenu = null;
    visibleClientMenu = null;
    sortSub: any;
    currAP: Ap = null;

    faUnlock = faUnlock;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'rssi', direction: 'asc', type:''};
        this.update(this.api.session.wifi['aps']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.wifi['aps']);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.aps, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    setAlias(client) {
        let alias = prompt("Set an alias for this client:", client.alias);
        if( alias.trim() == "" )
            alias = '""';

        this.api.cmd("alias " + client.mac + " " + alias);
    }

    private update(aps) {
        if( $('.menu-dropdown').is(':visible') )
            return;

        if( aps.length == 0 )
            this.currAP = null;

        this.aps = aps; 
        this.sortService.sort(this.aps, this.sort);

        if( this.currAP != null ) {
            for( let i = 0; i < this.aps.length; i++ ) {
                let ap = this.aps[i];
                if( ap.mac == this.currAP.mac ) {
                    this.currAP = ap;
                    break;
                }
            }

            this.sortService.sort(this.currAP.clients, this.sort);
        }
    }
}
