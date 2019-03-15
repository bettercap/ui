import {
    Component, 
    EventEmitter, 
    OnInit, 
} from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';  
import { ApiService } from '../../services/api.service';
import { EventComponent } from '../event/event.component';

import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
    selector: 'hydra-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
    faSignOutAlt = faSignOutAlt;

    numEvents = 0;
    numHosts = 0;
    numAps = 0;
    numBLE = 0;
    numHID = 0;

    modNotificationCache = {};

    sessionError: any;
    commandError: any;

    constructor(private api: ApiService, private router: Router, private toastr: ToastrService) { 
        this.updateSession(this.api.session);
        this.updateEvents(this.api.events, true);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.updateSession(session);
        });

        this.api.onNewEvents.subscribe(events => {
            this.updateEvents(events);
        });

        this.api.onSessionError.subscribe(error => {
            console.error("session error", error);
            this.sessionError = error;
        });

        this.api.onCommandError.subscribe(error => {
            console.error("command error", error);
            if( error.error.indexOf('already running') == -1 && error.error.indexOf('is not running') == -1 ) {
                this.commandError = error;
                $('#commandError').modal('show');
            }
        });
    }

    private updateSession(session) {
        this.numHosts = session.lan['hosts'].length; 
        this.numAps = session.wifi['aps'].length; 
        this.numBLE = session.ble['devices'].length; 
        this.numHID = session.hid['devices'].length; 
    }

    private onModuleEvent(event, firstUpdate: boolean) {
        let modName = event.data;
        let evKey = event.tag + "::" + modName + "::" + event.time;
        if( evKey in this.modNotificationCache === false ) {
            this.modNotificationCache[evKey] = true;
            if( firstUpdate == false ) {
                if( event.tag == 'mod.started' ) {
                    this.toastr.success(modName + " module started.");
                } else {
                    this.toastr.warning(modName + " module stopped.");
                }
            }
        }
    }

    private updateEvents(events, firstUpdate: boolean = false) {
        this.numEvents = events.length;
        for( let i = 0; i < this.numEvents; i++ ) {
            let event = events[i];
            if( event.tag.indexOf('mod.') == 0 ) {
                this.onModuleEvent(event, firstUpdate);
            }
        }
    }

    logout() {
        this.api.logout();
        this.router.navigateByUrl("/login");
    }
}
