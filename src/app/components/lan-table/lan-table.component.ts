import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { ApiService } from '../../services/api.service';
import { Host } from '../../models/host';
import { OmniBarService } from '../../services/omnibar.service';
import { ClipboardService } from '../../services/clipboard.service';

declare var $: any;

@Component({
    selector: 'ui-lan-table',
    templateUrl: './lan-table.component.html',
    styleUrls: ['./lan-table.component.scss']
})
export class LanTableComponent implements OnInit, OnDestroy {
    hosts: Host[] = [];

    isSpoofing: boolean = false;
    viewSpoof: boolean = false;
    spoofList: any = {};
    spoofOpts: any = {
        targets: '',
        whitelist: '',
        fullduplex: false,
        internal: false,
        ban: false
    };

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

    constructor(private api: ApiService, private sortService: SortService, public omnibar: OmniBarService, public clipboard: ClipboardService) { 
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

    isSpoofed(host : any) : boolean {
        return (host.ipv4 in this.spoofList);
    }

    private updateSpoofOpts() {
        this.spoofOpts.targets = Object.keys(this.spoofList).join(', ');
    }

    private resetSpoofOpts() {
        this.spoofOpts = {
            targets: this.api.session.env.data['arp.spoof.targets'],
            whitelist: this.api.session.env.data['arp.spoof.whitelist'],
            fullduplex: this.api.session.env.data['arp.spoof.fullduplex'].toLowerCase() == 'true',
            internal: this.api.session.env.data['arp.spoof.internal'].toLowerCase() == 'true',
            ban: false
        };
    }

    hideSpoofMenu() {
        this.viewSpoof = false; 
        this.resetSpoofOpts();
    }

    showSpoofMenuFor( host : Host, add : boolean ) {
        if( add )
            this.spoofList[host.ipv4] = true;
        else
            delete this.spoofList[host.ipv4];

        this.updateSpoofOpts();
        this.visibleMenu = null; 
        this.viewSpoof = true;
    }

    updateSpoofingList() {
        let newSpoofList = this.spoofList;

        $('.spoof-toggle').each((i, toggle) => {
            let $toggle = $(toggle);
            let ip = $toggle.attr('data-ip');
            if( $toggle.is(':checked') ) {
                newSpoofList[ip] = true;
            } else {
                delete newSpoofList[ip];
            }
        });

        this.spoofList = newSpoofList;
        this.updateSpoofOpts();
    }

    onSpoofStart() {
        if( this.isSpoofing && !confirm("This will unspoof the current targets, set the new parameters and restart the module. Continue?") )
            return;

        this.api.cmd('set arp.spoof.targets ' + (this.spoofOpts.targets == "" ? '""' : this.spoofOpts.targets));
        this.api.cmd('set arp.spoof.whitelist ' + (this.spoofOpts.whitelist == "" ? '""' : this.spoofOpts.whitelist));
        this.api.cmd('set arp.spoof.fullduplex ' + this.spoofOpts.fullduplex);
        this.api.cmd('set arp.spoof.internal ' + this.spoofOpts.internal);

        let onCmd = this.spoofOpts.ban ? 'arp.ban on' : 'arp.spoof on';
        
        if( this.isSpoofing ) {
            this.api.cmd('arp.spoof off; ' + onCmd);
        }
        else {
            this.api.cmd(onCmd);
        }

        this.viewSpoof = false;
        this.resetSpoofOpts();
    }

    private update(session) {
        const ipRe = /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/;

        let spoofing = this.api.session.env.data['arp.spoof.targets']
            // split by comma and trim spaces
            .split(',')
            .map(s => s.trim())
            // remove empty elements
            .filter(s => s.length);

        this.isSpoofing = this.api.module('arp.spoof').running;
        this.scanState = this.api.module('syn.scan').state;

        // freeze the interface while the user is doing something
        if( this.viewSpoof || $('.menu-dropdown').is(':visible') )
            return;
        
        this.resetSpoofOpts();
        this.spoofList = {};
        // if there are elements that are not IP addresses, it means the user
        // has set the variable manually, which overrides the UI spoof list.
        for( let i = 0; i < spoofing.length; i++ ) {
            if( ipRe.test(spoofing[i]) ) {
               this.spoofList[spoofing[i]] = true; 
            } else {
                this.spoofList = {};
                break;
            }
        }

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

        if( this.iface.mac == this.gateway.mac ) {
            this.hosts.push(this.iface);
        } else {
            this.hosts.push(this.iface);
            this.hosts.push(this.gateway);
        }

        this.sortService.sort(this.hosts, this.sort)
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

        if( alias.trim() == "" )
            alias = '""';

        this.api.cmd("alias " + mac + " " + alias);
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
