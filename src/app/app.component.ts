import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
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

    constructor(public api: ApiService, private router: Router) {
        this.api.onLoggedIn.subscribe(() => {
            console.log("logged in");
            this.session = this.api.session;
            this.api.pollSession().subscribe(
                (session) => { 
                    // console.log("session update:", session); 
                    this.session = session; 
                }
            );
            this.api.pollEvents().subscribe(
                (events) => { 
                    // console.log("events update:", events); 
                }
            );
        });

        this.api.onLoggedOut.subscribe(error => {
            console.log("logged out");
            this.session = null;
            this.router.navigateByUrl("/login");
        });
    }

    ngOnInit() {
        if( !this.session ) {
            this.api.loadCreds();
        }
    }

    ngOnDestroy() {

    }
}
