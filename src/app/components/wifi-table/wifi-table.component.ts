import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { ApiService } from '../../services/api.service';
import { Ap } from '../../models/ap';
import { Module } from '../../models/module';
import { OmniBarService } from '../../services/omnibar.service';
import { ClipboardService } from '../../services/clipboard.service';

declare var $: any;

@Component({
    selector: 'ui-wifi-table',
    templateUrl: './wifi-table.component.html',
    styleUrls: ['./wifi-table.component.scss']
})
export class WifiTableComponent implements OnInit, OnDestroy {
    aps: Ap[] = [];
    wifi: Module;
    sort: ColumnSortedEvent;
    visibleWPS = null;
    visibleClients = {};
    visibleMenu = null;
    visibleClientMenu = null;
    sortSub: any;
    currAP: Ap = null;
    hopping: boolean = true;

    constructor(private api: ApiService, private sortService: SortService, public omnibar: OmniBarService, public clipboard: ClipboardService) {
        this.sort = { field: 'rssi', direction: 'asc', type: '' };
        this.update(this.api.session);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.aps, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    setAlias(host) {
        $('#in').val(host.alias);
        $('#inhost').val(host.mac);
        $('#inputModalTitle').html('Set alias for ' + host.mac);
        $('#inputModal').modal('show');
    }

    doSetAlias() {
        $('#inputModal').modal('hide');

        let mac = $('#inhost').val();
        let alias = $('#in').val();

        if (alias.trim() == "")
            alias = '""';

        this.api.cmd("alias " + mac + " " + alias);
    }

    pathFriendlyName(ap) {
        let bssid = ap.mac.replaceAll(':', '');
        let essid = ap.hostname.replaceAll(/[^a-zA-Z0-9]+/g, '');
        return essid != '' ? essid + '_' + bssid : bssid;
    }

    handshakeFileFor(ap) {
        let isAggregate = this.api.env('wifi.handshakes.aggregate');
        if (isAggregate == true) {
            return this.api.env('wifi.handshakes.file');
        } else {
            let paths = this.api.env('wifi.handshakes.file').split('/');
            paths.pop();
            let parent = paths.join('/');
            let file = this.pathFriendlyName(ap) + ".pcap";
            return parent + '/' + file;
        }
    }

    downloadHandshakeFor(ap) {
        console.log('downloadHandshakeFor', ap);

        let filePath = this.handshakeFileFor(ap);
        let fileName = filePath.split('/').at(-1);

        this.api.readFile(filePath).subscribe(
            (val) => {
                var file = new File([val], fileName, { type: 'application/octect-stream' });
                var isChrome = !!window.chrome;
                var isIE = /*@cc_on!@*/false || !!document.documentMode;
                var isEdge = !isIE && !!window.StyleMedia;

                if (isChrome) {

                    var url = window.URL || window.webkitURL;

                    var downloadLink = $('<a></a>');
                    downloadLink.attr('href', url.createObjectURL(file));
                    downloadLink.attr('target', '_self');
                    downloadLink.attr('download', fileName);
                    downloadLink[0].click();
                }
                else if (isEdge || isIE) {
                    window.navigator.msSaveOrOpenBlob(file, fileName);

                }
                else {
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }

            },
            error => {
                alert(error.error);
            },
            () => {
                console.log("read file done");
            });
    }

    private update(session) {
        this.wifi = this.api.module('wifi');
        if (this.wifi && this.wifi.state && this.wifi.state.channels) {
            this.hopping = this.wifi.state.channels.length > 1;
        }

        if ($('.menu-dropdown').is(':visible'))
            return;

        let aps = session.wifi['aps'];

        if (aps.length == 0)
            this.currAP = null;

        this.aps = aps;
        this.sortService.sort(this.aps, this.sort);

        if (this.currAP != null) {
            for (let i = 0; i < this.aps.length; i++) {
                let ap = this.aps[i];
                if (ap.mac == this.currAP.mac) {
                    this.currAP = ap;
                    break;
                }
            }

            this.sortService.sort(this.currAP.clients, this.sort);
        }
    }
}
