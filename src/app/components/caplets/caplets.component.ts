import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService } from '../../services/sort.service';
import { Session } from '../../models/session';
import { OmnibarComponent } from '../omnibar/omnibar.component';

declare var $: any;

@Component({
    selector: 'hydra-caplets',
    templateUrl: './caplets.component.html',
    styleUrls: ['./caplets.component.scss']
})
export class CapletsComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    caplets: any[] = [];
    session: Session;

    successMessage: string = '';
    errorMessage: string = '';
    curTab: number = 0;
    curCap: any = null;

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

    runCaplet() {
        this.api.cmdResponse("include " + this.curCap.path).subscribe(
            (val) => {
                this.successMessage = 'Caplet executed.';
            },
            error => {
                this.errorMessage = error.error;
            },
            () => {}
        );
    }

    saveCaplet() {
        let code = $('#capCode').val();
        this.api.writeFile(this.curCap.path, code).subscribe(
            (val) => {
                this.successMessage = 'Caplet saved.';
            },
            error => {
                this.errorMessage = error.error;
            },
            () => {}
        );
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

