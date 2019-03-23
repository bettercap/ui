import {Component, Output, Input, OnInit, OnDestroy} from '@angular/core';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs/Observable';
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
    @Input() modules: any = {}
    @Input() clearCmd: string = "";
    @Input() withCmd: boolean;
    @Input() withLimit: boolean = false;
    @Input() withIfaces: boolean = false;

    enabled: any = {}
    query: string = '';
    cmd: string = '';
    ifaces: any = [];

    constructor(private api: ApiService, private toastr: ToastrService) { }

    ngOnInit() {
        this.update();
        this.api.onNewData.subscribe(session => {
            this.update();
        });
    }

    private update() {
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
