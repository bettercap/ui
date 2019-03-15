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
    @Input() withCmd: boolean;

    modEnabled: boolean = false;
    query: string = '';
    cmd: string = '';
    cmdError: any = null;

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

    // https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings
    cleanBash(message : string) : string {
        return message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') ;
    }

    onCmd() {
        this.cmdError = null;

        let cmd = this.cmd.trim();
        if( cmd.length > 0 ) {
            this.cmd = '';
            this.api.cmdResponse(cmd).subscribe(
                (response) => {},
                error => {
                    this.cmdError = this.cleanBash(error.error);
                },
                () => {});
        }
    }
}
