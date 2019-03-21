import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { Event } from '../../models/event';
import { OmnibarComponent } from '../omnibar/omnibar.component';

declare var $: any;

@Component({
    selector: 'hydra-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    events: Event[] = [];
    ignored: string[] = [];
    modEnabled: boolean = false;
    sort: ColumnSortedEvent;
    query: string = '';
    subscriptions: any = [];

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'time', direction: 'asc', type:''};
        this.update(this.api.events);
    }

    ngOnInit() {
        this.subscriptions = [
            this.api.onNewEvents.subscribe(events => {
                this.update(events);
            }),
            this.sortService.onSort.subscribe(event => {
                this.sort = event;
                this.sortService.sort(this.events, event);
            })
        ];
    }

    ngOnDestroy() {
        for( let i = 0; i < this.subscriptions.length; i++ ){
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
    }

    private update(events) {
        var mod = this.api.module('events.stream');

        this.modEnabled = mod.running;
        this.ignored = mod.state.ignoring.sort();
        this.events = events; 
        this.sortService.sort(this.events, this.sort)
    }

    btnFor(tag : string) : string {
        if( tag == 'wifi.client.handshake' )
            return 'danger';

        tag = tag.split('.')[0];
        switch(tag) {
            case 'wifi': return 'success';
            case 'endpoint': return 'secondary';
            case 'ble': return 'primary';
            case 'hid': return 'warning';
            default: return 'dark';
        }
    }

    clear() {
        this.api.clearEvents();
        this.events = [];
    }

    toggleModule() {
        let toggle = this.api.isModuleEnabled('events.stream') ? 'off' : 'on';
        let enabled = toggle == 'on' ? true : false;
        this.api.cmd("events.stream " + toggle);
        this.modEnabled = enabled;
    }
}
