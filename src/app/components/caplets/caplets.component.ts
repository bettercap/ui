import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService } from '../../services/sort.service';
import { Session } from '../../models/session';
import { OmniBarService } from '../../services/omnibar.service';

declare var $: any;

@Component({
    selector: 'ui-caplets',
    templateUrl: './caplets.component.html',
    styleUrls: ['./caplets.component.scss']
})
export class CapletsComponent implements OnInit, OnDestroy {
    caplets: any[] = [];
    session: Session;

    successMessage: string = '';
    errorMessage: string = '';
    curTab: number = 0;
    curCap: any = null;

    constructor(private api: ApiService, private sortService: SortService, public omnibar: OmniBarService) { 
        this.update(this.api.session);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session);
        });
    }

    ngOnDestroy() {

    }

    onUpdateAll() {
        if( confirm("This will download the new caplets from github and overwrite the previously installed ones, continue?") ) {
            this.api.cmd('caplets.update');
        }
    }

    runCaplet(cap) {
        this.api.cmd("include " + cap.path, true).subscribe(
            (val) => {
                this.successMessage = cap.path + ' executed.';
            },
            error => {
                this.errorMessage = error.error;
            },
            () => {}
        );
    }

    saveCaplet(cap) {
        let code = $('#capCode' + cap.index).val();
        this.api.writeFile(cap.path, code).subscribe(
            (val) => {
                this.successMessage = cap.path + ' saved.';
            },
            error => {
                this.errorMessage = error.error;
            },
            () => {}
        );
    }

    curScripts() {
        if( !this.curCap )
            return [];

        this.curCap.index = 0;
        let files = [this.curCap];
        for( let i = 0; i < this.curCap.scripts.length; i++ ){
            let script = this.curCap.scripts[i];
            script.index = i + 1;
            files.push(script);
        }

        return files;
    }

    private update(session) {
        for( let i = 0; i < session.caplets.length; i++ ) {
            let cap = session.caplets[i];
            if( !this.curCap || this.curCap.name == cap.name ) {
                this.curCap = cap;
                break;
            }
        }

        this.sortService.sort(session.caplets, {
            field: 'name',
            direction: 'desc',
            type: ''
        }); 

        this.session = session;
        this.caplets = session.caplets; 
    }
}

