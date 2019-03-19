import {Component, Output, Input, OnInit, OnDestroy} from '@angular/core';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ApiService} from '../../services/api.service';
import {Observable} from 'rxjs/Observable';

// due to https://github.com/ng-bootstrap/ng-bootstrap/issues/917
let handlers = [];

@Component({
    selector: 'omnibar',
    templateUrl: './omnibar.component.html',
    styleUrls: ['./omnibar.component.scss']
})
export class OmnibarComponent implements OnInit, OnDestroy {
    @Input() modName: string;
    @Input() toggleCmd: string;
    @Input() clearCmd: string;
    @Input() withCmd: boolean;

    modEnabled: boolean = false;
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

        for( let i = 0; i < this.api.session.modules.length; i++ ){
            let mod = this.api.session.modules[i];
            if( this.modName && mod.name == this.modName )
                this.modEnabled = mod.running;

            for( let j = 0; j < mod.handlers.length; j++ ) {
                handlers.push( mod.handlers[j].name );
            }
        }   
            
        this.api.session.modules;
        this.modEnabled = this.api.isModuleEnabled(this.modName); 
    }

    ngOnDestroy() {
        
    }

    onClearClicked() {
        this.api.cmd(this.clearCmd);
    }

    onModuleToggleClicked() {
        this.update();
        
        let toggle = this.modEnabled ? 'off' : 'on';
        let mods = this.toggleCmd.split(',');

        this.modEnabled = !this.modEnabled;

        for( let i = 0; i < mods.length; i++ ) {
            let modName = mods[i].trim();
            this.api.cmd(modName + ' ' + toggle);
        }
    }

    searchCommand(text$: Observable<string>) {
        return text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 2 ? []
                : handlers.filter(h => h.toLowerCase().indexOf(term.toLowerCase()) > -1))
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
