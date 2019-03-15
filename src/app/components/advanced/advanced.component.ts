import {Component, OnInit, OnDestroy} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService } from '../../services/sort.service';
import { Module } from '../../models/module';

@Component({
    selector: 'hydra-advanced',
    templateUrl: './advanced.component.html',
    styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit, OnDestroy {
    modules: Module[];

    successMessage: string = '';
    curTab: number = 0;
    curMod: Module = null;

    constructor(private api: ApiService, private sortService: SortService) { 
        this.curMod = this.api.session.modules[0];
        this.update(this.api.session.modules);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.modules);
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

    private update(modules) {
        this.sortService.sort(modules, {
            field: 'name',
            direction: 'desc',
            type: ''
        }); 
        this.modules = modules; 
    }
}

