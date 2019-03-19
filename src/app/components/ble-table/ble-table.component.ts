import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {Device} from '../../models/device';
import { OmnibarComponent } from '../omnibar/omnibar.component';

import {faCheckCircle, faTimes} from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
    selector: 'hydra-ble-table',
    templateUrl: './ble-table.component.html',
    styleUrls: ['./ble-table.component.scss']
})
export class BleTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    devices: Device[] = [];
    sort: ColumnSortedEvent;
    sortSub: any;
    currDev: Device = null;
    currScan: Device = null;

    faCheckCircle = faCheckCircle;
    faTimes = faTimes;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'rssi', direction: 'asc', type:''};
        this.update(this.api.session);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.devices, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    enumServices(dev) {
        this.currScan = dev;
        this.api.cmd('ble.enum ' + dev.mac);
    }

    showWriteModal(dev, ch) {
        $('#writeMAC').val(dev.mac);
        $('#writeUUID').val(ch.uuid);
        $('#writeData').val("FFFFFF");
        $('#writeModal').modal('show');
    }

    doWrite() {
        let mac = $('#writeMAC').val();
        let uuid = $('#writeUUID').val();
        let data = $('#writeData').val();
        $('#writeModal').modal('hide');
        this.api.cmd("ble.write " + mac + " " + uuid + " " + data);
    }

    private update(session) {
        this.currScan = this.api.module('ble.recon').state.scanning;

        let devices = session.ble['devices'];
        if( devices.length == 0 )
            this.currDev = null;

        this.sortService.sort(this.devices, this.sort)
        this.devices = devices; 

        if( this.currDev != null ) {
            for( let i = 0; i < this.devices.length; i++ ) {
                let dev = this.devices[i];
                if( dev.mac == this.currDev.mac ) {
                    this.currDev = dev;
                    break;
                }
            }
        }
    }
}
