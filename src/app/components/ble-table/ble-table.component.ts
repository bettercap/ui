import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {Device} from '../../models/device';
import { OmnibarComponent } from '../omnibar/omnibar.component';

import {faCheckCircle, faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'hydra-ble-table',
    templateUrl: './ble-table.component.html',
    styleUrls: ['./ble-table.component.scss']
})
export class BleTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    devices: Device[];
    sort: ColumnSortedEvent;
    sortSub: any;

    faCheckCircle = faCheckCircle;
    faTimes = faTimes;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'rssi', direction: 'asc', type:''};
        this.update(this.api.session.ble['devices']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.ble['devices']);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.devices, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    private update(devices) {
        this.devices = devices; 
        this.sortService.sort(this.devices, this.sort)
    }
}
