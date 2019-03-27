import {
    Component, 
    OnInit, 
    OnDestroy,
    ComponentFactoryResolver,
    Injector
} from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';  
import { ApiService } from '../../services/api.service';
import { EventComponent } from '../event/event.component';

declare var $: any;

@Component({
    selector: 'ui-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
    apiFirstUpdate: boolean = true;

    counters : any = {
        events: 0,
        hosts: 0,
        aps: 0,
        ble: 0,
        hid: 0,
        caplets: 0,
        running: 0
    };

    subscriptions: any = [];
    modNotificationCache = {};

    sessionError: any;
    commandError: any;

    constructor(
        public api: ApiService, 
        private router: Router, 
        private toastr: ToastrService,
        private resolver: ComponentFactoryResolver, 
        private injector: Injector
    ) { 
        this.updateSession(this.api.session);
        this.updateEvents(this.api.events, true);
    }

    private skipError(error) {
        return false;
    }

    ngOnInit() {
        this.subscriptions = [
            this.api.onNewData.subscribe(session => {
                this.updateSession(session);
            }),
            this.api.onNewEvents.subscribe(events => {
                this.updateEvents(events, this.apiFirstUpdate);
                this.apiFirstUpdate = false;
            }),
            this.api.onSessionError.subscribe(error => {
                console.error("session error", error);
                this.apiFirstUpdate = true;
                this.sessionError = error;
            }),
            this.api.onCommandError.subscribe(error => {
                console.error("command error", error);
                this.commandError = error;
                $('#commandError').modal('show');
            })
        ];
    }

    ngOnDestroy() {
        for( let i = 0; i < this.subscriptions.length; i++ ){
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
    }

    private updateSession(session) {
        this.sessionError = null;
        this.counters.hosts = session.lan['hosts'].length || 0; 
        this.counters.aps = session.wifi['aps'].length || 0; 
        this.counters.ble = session.ble['devices'].length || 0; 
        this.counters.hid = session.hid['devices'].length || 0; 
        this.counters.caplets = session.caplets.length || 0; 
        this.counters.running = session.modules.filter(m => m.running).length;
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
        // generic logs (but not the syn.scan progress or hid payloads)
        if( event.tag == 'sys.log' && event.data.Message.indexOf('syn.scan') == -1 && event.data.Message.indexOf('payload for') == -1 )
            return true;
        // some recon module got a new target
        // if( event.tag.indexOf('.new') != -1 && event.tag != 'wifi.client.new' )
        // return true;
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

        else if( event.tag == 'sys.log' ) {
            if( event.data.Level == 3 /* WARNING */ )
                return 'toast-warning';

            else if( event.data.Level == 4 /* ERROR */ || event.data.Level == 5 /* FATAL */ )
                return 'toast-error';
        }

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
        this.sessionError = null;
        this.counters.events = events.length;
        if( this.counters.events == 0 ){
            this.toastr.clear();
        } else {
            for( let i = 0; i < this.counters.events; i++ ) {
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
