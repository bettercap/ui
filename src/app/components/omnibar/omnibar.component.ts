import {Component, Output, Input, OnInit, OnDestroy} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
    selector: 'omnibar',
    templateUrl: './omnibar.component.html',
    styleUrls: ['./omnibar.component.scss']
})
export class OmnibarComponent implements OnInit, OnDestroy {
    @Input() modName: string;
    @Input() toggleCmd: string;
    @Input() clearCmd: string;

    modEnabled: boolean = false;
    query: string = '';

    constructor(private api: ApiService) { 
        
    }

    ngOnInit() {
        if( this.modName ) {
            this.update();
            this.api.onNewData.subscribe(session => {
                this.update();
            });
        }
    }

    private update() {
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
            this.api.cmd(mods[i].trim() + ' ' + toggle);
        }
    }
}
