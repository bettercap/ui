import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService } from '../../services/sort.service';
import { Module } from '../../models/module';
import { Session } from '../../models/session';
import { OmnibarComponent } from '../omnibar/omnibar.component';

declare var $: any;

@Component({
    selector: 'hydra-advanced',
    templateUrl: './advanced.component.html',
    styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    modules: Module[] = [];
    session: Session;

    successMessage: string = '';
    curTab: number = 0;
    curMod: Module = null;
    curCmd: any = {
        name: '',
        description: '',
        parser: '',
        tokens: []
    };

    pktTot: number = 0;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.update(this.api.session);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });
    }

    ngOnDestroy() {

    }

    saveParam(param : any) {
        this.successMessage = '';

        let val = param.current_value;

        if( param.validator != "" ) {
            let validator = new RegExp(param.validator);
            if( validator.test(val) == false ) {
                this.api.onCommandError.emit({
                    error: "Value " + val + 
                    " is not valid for parameter '" + param.name + 
                    "' (validator: '" + param.validator + "')"
                });
                return;
            }
        }

        if( val == "" ) {
            val = '""';
        }

        this.api.cmd("set " + param.name + " " + val);
        this.successMessage = "Parameter " + param.name + " successfully updated.";
    }

    showCommandModal(cmd) {
        /* 
         * Command handlers can be in the form of:
         *
         * cmd.name on
         *
         * in which case we can just go ahead and run it, or:
         *
         * cmd.name PARAM OPTIONAL?
         *
         * in which case we need input from the user.
         */
        this.curCmd = cmd;
        this.curCmd.tokens = cmd.name
            .replace(', ', ',') // make lists a single item
            .split(' ') // split by space
            .filter(token => (token == token.toUpperCase())) // only select the uppercase tokens
            .map(token => ({
                // replace stuff that can be bad for html attributes
                label: token.replace(/[^A-Z0-9_,]+/g, " ").trim(),
                id: token.replace(/[\W_]+/g, ""),
            }));
        
        if( this.curCmd.tokens.length == 0 ) {
            this.api.cmd(this.curCmd.name);
        } else {
            $('#commandModal').modal('show');
        }
    }

    doRunCommand() {
        let compiled = this.curCmd.name.split(' ')[0];
        let tokens = this.curCmd.tokens;

        for( let i = 0; i < tokens.length; i++ ) {
            let val = $('#tok'+tokens[i].id).val();
            compiled += ' ' + (val == "" ? '""' : val);
        }

        $('#commandModal').modal('hide');
        this.api.cmd(compiled);
    }

    private update(session) {
        if( this.curMod ) {
            for( let i = 0; i < session.modules.length; i++ ) {
                let mod = session.modules[i];
                if( this.curMod.name == mod.name ) {
                    this.curMod.running = mod.running;
                    break;
                }
            }
        }

        this.sortService.sort(session.modules, {
            field: 'name',
            direction: 'desc',
            type: ''
        }); 

        this.pktTot = 0;
        for( let proto in session.packets.Protos ) {
            this.pktTot += session.packets.Protos[proto];
        }

        this.session = session;
        this.modules = session.modules; 
    }
}

