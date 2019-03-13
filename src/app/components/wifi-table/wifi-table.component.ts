import {Component, OnInit, OnDestroy} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {Ap} from '../../models/ap';

import {faUnlock} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-wifi-table',
    templateUrl: './wifi-table.component.html',
    styleUrls: ['./wifi-table.component.scss']
})
export class WifiTableComponent implements OnInit, OnDestroy {
    aps: Ap[];
    visibleWPS = {};
    visibleClients = {};
    sort: ColumnSortedEvent;
    sortSub: any;

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

    private update(aps) {
        this.aps = aps; 
        this.sortService.sort(this.aps, this.sort)
    }
}
