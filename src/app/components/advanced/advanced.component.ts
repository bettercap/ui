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

    paramValue(param : any) : string {
        console.log("paramValue", param);
        return "OK" + param.default_value;
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

