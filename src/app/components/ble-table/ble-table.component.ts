import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {Device} from '../../models/device';
import { OmniBarService } from '../../services/omnibar.service';

declare var $: any;

@Component({
    selector: 'ui-ble-table',
    templateUrl: './ble-table.component.html',
    styleUrls: ['./ble-table.component.scss']
})
export class BleTableComponent implements OnInit, OnDestroy {
    devices: Device[] = [];
    sort: ColumnSortedEvent;
    sortSub: any;
    visibleMenu: string = "";
    currDev: Device = null;
    currScan: Device = null;

    constructor(private api: ApiService, private sortService: SortService, private omnibar: OmniBarService) { 
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

    setAlias(dev) {
        $('#in').val(dev.alias);
        $('#inhost').val(dev.mac);
        $('#inputModalTitle').html('Set alias for ' + dev.mac);
        $('#inputModal').modal('show');
    }

    doSetAlias() {
        $('#inputModal').modal('hide');

        let mac = $('#inhost').val();
        let alias = $('#in').val();

        if( alias.trim() == "" )
            alias = '""';

        this.api.cmd("alias " + mac + " " + alias);
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

        // freeze the interface while the user is doing something
        if( $('.menu-dropdown').is(':visible') )
            return;

        let devices = session.ble['devices'];
        if( devices.length == 0 )
            this.currDev = null;

        this.sortService.sort(devices, this.sort)
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
