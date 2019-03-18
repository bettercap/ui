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
    currDev: Device = null;
    currScan: Device = null;

    faCheckCircle = faCheckCircle;
    faTimes = faTimes;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'rssi', direction: 'asc', type:''};
        this.update(this.api.session);
        this.checkEvents(this.api.events);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });

        this.api.onNewEvents.subscribe(events => {
            this.checkEvents(events);
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

    private checkEvents(events) {
        if( !this.currScan ) 
            return;

        for( let i = 0; i < events.length; i++ ) {
            let e = events[i];
            if( e.tag == 'ble.connection.timeout' || e.tag == 'ble.device.disconnected' ) {
                this.currScan = null;
                break;
            }
        }
    }

    private update(session) {
        let devices = session.ble['devices'];
        let modules = session.modules;

        for( let i = 0; i < modules.length; i++ ){
            let mod = modules[i];
            if( mod.name == 'ble.recon' ) {
                this.currScan = mod.state.scanning;
                break;
            }
        }

        if( devices.length == 0 )
            this.currDev = null;

        this.devices = devices; 
        this.sortService.sort(this.devices, this.sort)

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
