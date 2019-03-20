import {Component, Output, Input, OnInit, OnDestroy} from '@angular/core';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs/Observable';

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

    enabled: any = {}
    query: string = '';
    cmd: string = '';

    constructor(private api: ApiService) { 
        
    }

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
    }

    ngOnDestroy() {
        
    }

    onClearClicked() {
        this.api.cmd(this.clearCmd);
    }

    onModuleToggleClicked(mod : any) {
        this.update();
        
        let toggle = this.enabled[mod.key] ? 'off' : 'on';
        this.enabled[mod.key] = !this.enabled[mod.key];

        this.api.cmd(mod.value + ' ' + toggle);
    }

    searchCommand(text$: Observable<string>) {
        return text$.pipe(
            debounceTime(200),
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
