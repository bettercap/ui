import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from '../environments/environment';
import { ApiService } from './services/api.service';
import { Session } from './models/session';

const POLLING_INTERVAL = 1000;

@Component({
    selector: 'hydra-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    session: Session;

    eventsSubscription: any;
    sessionSubscription: any;

    constructor(public api: ApiService, private router: Router, private titleService: Title) {
        this.api.onLoggedIn.subscribe(() => {
            console.log("logged in");
            this.session = this.api.session;
            this.sessionSubscription = this.api.pollSession().subscribe( (session) => { this.session = session; });
            this.eventsSubscription = this.api.pollEvents().subscribe((events) => {});
        });

        this.api.onLoggedOut.subscribe(error => {
            console.log("logged out");

            this.session = null;

            if( this.sessionSubscription ) {
                this.sessionSubscription.unsubscribe();
                this.sessionSubscription = null;
            }

            if( this.eventsSubscription ) {
                this.eventsSubscription.unsubscribe();
                this.eventsSubscription = null;
            }

            this.router.navigateByUrl("/login");
        });
    }

    ngOnInit() {
        this.titleService.setTitle(environment.name + ' ' + environment.version);
        if( !this.session ) {
            this.api.loadCreds();
        }
    }

    ngOnDestroy() {

    }
}
