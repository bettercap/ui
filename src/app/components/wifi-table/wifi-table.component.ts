import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
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

    isRecon: boolean = false;
    viewSkip: boolean = false;
    skipDeauthList: any = {};
    skipAssocList: any = {};
    skipOpts: any = {
    deauthlist: '',
    assoclist: '',
    };
    viewTarget: boolean = false;
    targetList: any = {};
    targetOpts: any = {
    targetlist: ''
    };

    constructor(private api: ApiService, private sortService: SortService, public omnibar: OmniBarService, public clipboard: ClipboardService) { 
        this.sort = {field: 'rssi', direction: 'asc', type:''};
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

    isTarget(ap : any) : boolean {
        return (ap.mac in this.targetList);
    }

    private updateTargetOpts() {
        this.targetOpts.targetlist = Object.keys(this.targetList).join(', ');
    }

    private resetTargetOpts() {
        this.targetOpts = {
            targetlist: this.api.session.env.data['wifi.recon.target']
        };
    }

    hideTargetMenu() {
        this.viewTarget = false; 
        this.resetTargetOpts();
    }

    showTargetMenuFor( ap : Ap, add : boolean ) {
        if( add )
            this.targetList[ap.mac] = true;
        else
            delete this.targetList[ap.mac];

        this.updateTargetOpts();
        this.visibleMenu = null; 
        this.viewTarget = true;
    }

    updateTargetList() {
        let newTargetList = this.targetList;

        $('.target-toggle').each((i, toggle) => {
            let $toggle = $(toggle);
            let ip = $toggle.attr('data-ip');
            if( $toggle.is(':checked') ) {
                newTargetList[ip] = true;
            } else {
                delete newTargetList[ip];
            }
        });

        this.targetList = newTargetList;
        this.updateTargetOpts();
    }

    onTargetStart() {
        if( this.isRecon && !confirm("This will set the new target BSSID's and restart the module. Continue?") )
            return;

        this.api.cmd('set wifi.recon.targets ' + (this.targetOpts.targetlist == "" ? '""' : this.targetOpts.targetlist));

        let onCmd = 'wifi.recon on';

        if( this.isRecon ) {
            this.api.cmd('wifi.recon off; ' + onCmd);
        }
        else {
            this.api.cmd(onCmd);
        }

        this.viewTarget = false;
        this.resetTargetOpts();
    }

    saveTargetMenu() {
        this.api.cmd('set wifi.recon.targets ' + (this.targetOpts.targetlist == "" ? '""' : this.targetOpts.targetlist));
        this.viewTarget = false;
        this.resetTargetOpts();
    }

    isSkippedDeauth(ap : any) : boolean {
        return (ap.mac in this.skipDeauthList);
    }

    isSkippedAssoc(ap : any) : boolean {
        return (ap.mac in this.skipAssocList);
    }

    private updateSkipOpts() {
        this.skipOpts.deauthlist = Object.keys(this.skipDeauthList).join(', ');
        this.skipOpts.assoclist = Object.keys(this.skipAssocList).join(', ');
    }

    private resetSkipOpts() {
        this.skipOpts = {
            deauthlist: this.api.session.env.data['wifi.deauth.skip'],
            assoclist: this.api.session.env.data['wifi.assoc.skip']
        };
    }

    hideSkipMenu() {
        this.viewSkip = false; 
        this.resetSkipOpts();
    }

    showWhitelistMenuFor( ap : Ap, add : boolean) {
        if( add ) {
            if (ap.mac in this.skipDeauthList === false) {
                this.skipDeauthList[ap.mac] = true;
            }
            if (ap.mac in this.skipAssocList === false) {
                this.skipAssocList[ap.mac] = true;
            }
        }
        else {
            if (ap.mac in this.skipDeauthList) {
                delete this.skipDeauthList[ap.mac];
            }
            if (ap.mac in this.skipAssocList) {
                delete this.skipAssocList[ap.mac];
            }
        }
        this.updateSkipOpts();
        this.visibleMenu = null; 
        this.viewSkip = true;
    }

    updateSkippingList() {
        let newSkipDeauthList = this.skipDeauthList;

        $('.skip-deauth-toggle').each((i, toggle) => {
            let $toggle = $(toggle);
            let ip = $toggle.attr('data-ip');
            if( $toggle.is(':checked') ) {
                newSkipDeauthList[ip] = true;
            } else {
                delete newSkipDeauthList[ip];
            }
        });

        this.skipDeauthList = newSkipDeauthList;

        let newSkipAssocList = this.skipAssocList;

        $('.skip-assoc-toggle').each((i, toggle) => {
            let $toggle = $(toggle);
            let ip = $toggle.attr('data-ip');
            if( $toggle.is(':checked') ) {
                newSkipAssocList[ip] = true;
            } else {
                delete newSkipAssocList[ip];
            }
        });

        this.skipAssocList = newSkipAssocList;
        this.updateSkipOpts();
    }

    onSkipStart() {
        if( this.isRecon && !confirm("This will skip the current BSSID's, set the new parameters and restart the module. Continue?") )
            return;

        this.api.cmd('set wifi.deauth.skip ' + (this.skipOpts.deauthlist == "" ? '""' : this.skipOpts.deauthlist));
        this.api.cmd('set wifi.assoc.skip ' + (this.skipOpts.assoclist == "" ? '""' : this.skipOpts.assoclist));

        let onCmd = 'wifi.recon on';

        if( this.isRecon ) {
            this.api.cmd('wifi.recon off; ' + onCmd);
        }
        else {
            this.api.cmd(onCmd);
        }

        this.viewSkip = false;
        this.resetSkipOpts();
    }

    saveSkipMenu() {
        this.api.cmd('set wifi.deauth.skip ' + (this.skipOpts.deauthlist == "" ? '""' : this.skipOpts.deauthlist));
        this.api.cmd('set wifi.assoc.skip ' + (this.skipOpts.assoclist == "" ? '""' : this.skipOpts.assoclist));
        this.viewSkip = false;
        this.resetSkipOpts();
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

    private update(session) {
        let targeting = ''
        targeting = this.api.session.env.data['wifi.recon.targets']
            // split by comma and trim spaces
            .split(',')
            .map(s => s.trim())
            // remove empty elements
            .filter(s => s.length);
        let skippingdeauth = this.api.session.env.data['wifi.deauth.skip']
            // split by comma and trim spaces
            .split(',')
            .map(s => s.trim())
            // remove empty elements
            .filter(s => s.length);
        let skippingassoc = this.api.session.env.data['wifi.assoc.skip']
            // split by comma and trim spaces
            .split(',')
            .map(s => s.trim())
            // remove empty elements
            .filter(s => s.length);

        this.isRecon = this.api.module('wifi').running;
        // freeze the interface while the user is doing something
        if( this.viewSkip || this.viewTarget || $('.menu-dropdown').is(':visible') )
            return;

        this.resetSkipOpts();
        this.resetTargetOpts();
        
        this.skipDeauthList = {};
        for( let i = 0; i < skippingdeauth.length; i++ ) {
            this.skipDeauthList[skippingdeauth[i]] = true; 
        }

        this.skipAssocList = {};
        for( let i = 0; i < skippingassoc.length; i++ ) {
            this.skipAssocList[skippingassoc[i]] = true; 
        }

        this.targetList = {};
        for( let i = 0; i < targeting.length; i++ ) {
            this.targetList[targeting[i]] = true; 
        }

        this.wifi = this.api.module('wifi');
        if( this.wifi && this.wifi.state && this.wifi.state.channels ) {
            this.hopping = this.wifi.state.channels.length > 1;
        }

        if( $('.menu-dropdown').is(':visible') )
            return;

        let aps = session.wifi['aps'];

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
