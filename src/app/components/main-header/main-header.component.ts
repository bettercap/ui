import {
    Component, 
    OnInit, 
    ComponentFactoryResolver,
    Injector
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

    apiFirstUpdate: boolean = true;
    numEvents = 0;
    numHosts = 0;
    numAps = 0;
    numBLE = 0;
    numHID = 0;

    modNotificationCache = {};

    sessionError: any;
    commandError: any;

    constructor(
        private api: ApiService, 
        private router: Router, 
        private toastr: ToastrService,
        private resolver: ComponentFactoryResolver, 
        private injector: Injector
    ) { 
        this.updateSession(this.api.session);
        this.updateEvents(this.api.events, true);
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.updateSession(session);
        });

        this.api.onNewEvents.subscribe(events => {
            this.updateEvents(events, this.apiFirstUpdate);
            this.apiFirstUpdate = false;
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

    private eventCacheKey(event) {
        let key = event.tag + "::";
        if( typeof event.data == 'string' ) 
            key += event.data + "::";
        else
            key += "{}::";
        key += event.time;
        return key;
    }

    private eventHTML(event) : string {
        // reuse the EventComponent at runtime to get the same HTML
        // we'd have in the event table ... reusability FTW ^_^
        const factory = this.resolver.resolveComponentFactory(EventComponent);
        const component = factory.create(this.injector); 

        component.instance.event = event;
        component.changeDetectorRef.detectChanges();

        return component.location.nativeElement.innerHTML;
    }

    private isTrackedEvent(event) : boolean {
        // modules start and stop events
        if( event.tag.indexOf('mod.') == 0 )
            return true;
        // some recon module got a new target
        if( event.tag.indexOf('.new') != -1 )
            return true;
        // wifi l00t
        if( event.tag == 'wifi.client.handshake' )
            return true;

        return false;
    }

    private eventClass(event) : string {
        if( event.tag == 'mod.started' || event.tag.indexOf('.new') != -1 )
            return 'toast-success';
        
        else if( event.tag == 'mod.stopped' || event.tag == 'wifi.client.handshake' )
            return 'toast-warning';

        return 'toast-info';
    }

    private handleTrackedEvent(event, firstUpdate: boolean) {
        // since we're constantly polling for /api/events and we'll
        // end up getting the same events we already shown in multiple
        // requests, we need to "cache" this information to avoid showing
        // the same notification more than once.
        let evKey = this.eventCacheKey(event);
        if( evKey in this.modNotificationCache === false ) {
            this.modNotificationCache[evKey] = true;
            // first time we get the event we don't want to notify the user,
            // otherwise dozens of notifications might be generated after
            // a page refresh
            if( firstUpdate == false ) {
                this.toastr.show(
                    this.eventHTML(event), 
                    event.tag, 
                    { 
                        // any dangerous stuff should already be escaped by the 
                        // EventComponent anyway ... i hope ... ... i hope ...
                        enableHtml: true,
                        toastClass: 'ngx-toastr ' + this.eventClass(event)
                    }
                );
            }
        }
    }

    private updateEvents(events, firstUpdate: boolean = false) {
        this.numEvents = events.length;
        if( this.numEvents == 0 ){
            this.toastr.clear();
        } else {
            for( let i = 0; i < this.numEvents; i++ ) {
                let event = events[i];
                if( this.isTrackedEvent(event) ) {
                    this.handleTrackedEvent(event, firstUpdate);
                }
            }
        }
    }

    logout() {
        this.api.logout();
        this.router.navigateByUrl("/login");
    }
}
