import {Component, Output, Input, OnInit, OnDestroy} from '@angular/core';
import {Router, NavigationStart } from '@angular/router';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

import {OmniBarService} from '../../services/omnibar.service';
import {ApiService} from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';  

declare var $: any;

// due to https://github.com/ng-bootstrap/ng-bootstrap/issues/917
let handlers = [];
let params = [];

@Component({
    selector: 'omnibar',
    templateUrl: './omnibar.component.html',
    styleUrls: ['./omnibar.component.scss']
})
export class OmnibarComponent implements OnInit, OnDestroy {
    modules: any = {};
    clearCmd: string = "";
    withCmd: boolean = false;
    withLimit: boolean = false;
    withIfaces: boolean = false;

    enabled: any = {}
    cmd: string = '';
    ifaces: any = [];
    rest: any = null;

    configs: any = {
        '/lan': {
            'modules': {
                'net.recon': 'net.recon',
                'net.probe': 'net.probe'
            },
            'clearCmd': 'net.clear',
            'withCmd': true
        },

        '/wifi': {
            'modules': { 'wifi': 'wifi.recon' },
            'clearCmd': 'wifi.clear',
            'withCmd': true,
            'withIfaces': true
        },

        '/ble': {
            'modules': { 'ble.recon': 'ble.recon' },
            'clearCmd': 'ble.clear',
            'withCmd': true
        },

        '/hid': {
            'modules': { 'hid': 'hid.recon' },
            'clearCmd': 'hid.clear',
            'withCmd': true,
        },

        '/caplets': {
            'withCmd': true
        },

        '/advanced': {
            'withCmd': true
        },

        '/events': {
            'clearCmd': 'events.clear',
            'withCmd': true,
            'withLimit': true
        },
    };

    constructor(public svc: OmniBarService, private api: ApiService, private toastr: ToastrService, private router: Router) { 
        
    }

    ngOnInit() {
        this.router.events
        .subscribe((event) => {
            if( event instanceof NavigationStart) {
                this.updateState(event.url);
            }
        });

        this.updateState(this.router.url);

        this.update();
        this.api.onNewData.subscribe(session => {
            this.update();
        });
    }

    showRecordModal() {
        $('#recordFile').val('~/bettercap-session.record');
        // https://stackoverflow.com/questions/10636667/bootstrap-modal-appearing-under-background
        $('#recordModal').appendTo('body').modal('show');
    }

    doRecord() {
        $('#recordModal').modal('hide');

        let file = $('#recordFile').val();

        this.api.cmd("api.rest.record " + file);
    }

    stopRecording() {
        this.api.cmd("api.rest.record off");
    }

    showReplayModal() {
        $('#replayFile').val('~/bettercap-session.record');
        // https://stackoverflow.com/questions/10636667/bootstrap-modal-appearing-under-background
        $('#replayModal').appendTo('body').modal('show');
    }

    doReplay() {
        $('#replayModal').modal('hide');

        let file = $('#replayFile').val();

        this.api.cmd("api.rest.replay " + file);
    }

    stopReplaying() {
        this.api.cmd("api.rest.replay off");
    }

    replayPerc() : string {
        let perc = parseInt(String((this.rest.state.rec_cur_frame / this.rest.state.rec_frames) * 100));
        return String(perc);
    }

    private updateState( url : string ) {
        this.modules = {};
        this.clearCmd = '';
        this.withCmd  = true;
        this.withLimit = false;
        this.withIfaces = false;

        for( var path in this.configs ) {
            if( url.indexOf(path) === 0 ) {
                for( var attr in this.configs[path] ) {
                    this[attr] = this.configs[path][attr];
                }
                return;
            }
        }
    }

    private update() {
        this.rest = this.api.module('api.rest');

        handlers = [];
        params = [];

        for( let i = 0; i < this.api.session.modules.length; i++ ){
            let mod = this.api.session.modules[i];

            this.enabled[mod.name] = mod.running;

            for( let j = 0; j < mod.handlers.length; j++ ) {
                handlers.push( mod.handlers[j].name );
            }

            for( let name in mod.parameters ) {
                params.push( mod.parameters[name].name );
            }
        }   

        this.ifaces = [];
        for( let i = 0; i < this.api.session.interfaces.length; i++ ) {
            let iface = this.api.session.interfaces[i];

            if( iface.addresses.length == 0 && !iface.flags.includes('LOOPBACK') ) {
                this.ifaces.push(iface);
            }
        }
    }

    ngOnDestroy() {
        
    }

    onClearClicked() {
        if( confirm("This will clear the records from both the API and the UI, continue?") ) {
            this.api.cmd(this.clearCmd);
        }
    }

    isWifiIface(iface : any ) : boolean {
        let wif = this.api.session.env.data['wifi.interface'];
        if( wif == '' ) {
            return iface.name == this.api.session.interface.hostname;
        }
        return iface.name == wif;
    }

    onSetWifiInterface(name : string) {
        this.api.cmd('set wifi.interface ' + name);
        this.toastr.info("Set wifi.interface to " + name);
    }

    onModuleToggleClicked(mod : any) {
        this.update();
        
        let toggle = this.enabled[mod.key] ? 'off' : 'on';
        let selected = $('#wifiiface').val();
        let bar = this;
        let cb = function() {
            bar.enabled[mod.key] = !bar.enabled[mod.key];
            bar.api.cmd(mod.value + ' ' + toggle);
        };

        if( selected && toggle == 'on' && this.withIfaces ) {
            this.api.cmd('set wifi.interface ' + selected, true).subscribe(
                (val) => {
                    cb();
                },
                error => {
                    cb();
                },
                () => {}
            );
        } else {
            cb();
        }
    }

    searchCommand(text$: Observable<string>) {
        return text$.pipe(
            distinctUntilChanged(),
            map(function(term) {
                if( term.length < 2 )
                    return [];

                let lwr = term.toLowerCase();
                if( lwr.indexOf('set ') === 0 ) {
                    let par = lwr.substring(4);
                    return params
                        .filter(p => p.toLowerCase().indexOf(par) > -1)
                        .map(p => 'set ' + p);
                }
                
                return handlers.filter(h => h.toLowerCase().indexOf(lwr) > -1);
            })
        );
    }

    onCmd() {
        let cmd = this.cmd.trim();
        if( cmd.length > 0 ) {
            this.cmd = '';
            this.api.cmd(cmd);
        }
    }
}
