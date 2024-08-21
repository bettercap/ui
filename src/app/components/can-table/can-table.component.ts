import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { ApiService } from '../../services/api.service';
import { CANDevice } from '../../models/can.device';
import { Module } from '../../models/module';
import { OmniBarService } from '../../services/omnibar.service';
import { ClipboardService } from '../../services/clipboard.service';

declare var $: any;

@Component({
    selector: 'ui-can-table',
    templateUrl: './can-table.component.html',
    styleUrls: ['./can-table.component.scss']
})
export class CanTableComponent implements OnInit, OnDestroy {
    devices: CANDevice[] = [];
    can: Module = null;
    sort: ColumnSortedEvent;
    sortSub: any;
    visibleMenu: string = "";

    constructor(private api: ApiService, private sortService: SortService, public omnibar: OmniBarService, public clipboard: ClipboardService) {
        this.sort = { field: 'name', direction: 'asc', type: '' };
        this.update(this.api.session.can['devices']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.can['devices']);
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
        this.can = this.api.module('can');
        this.devices = devices;
        this.sortService.sort(this.devices, this.sort);
    }
}
