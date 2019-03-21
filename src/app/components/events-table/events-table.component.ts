import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { Event } from '../../models/event';
import { OmnibarComponent } from '../omnibar/omnibar.component';

@Component({
    selector: 'hydra-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit, OnDestroy {
    @ViewChild(OmnibarComponent) omnibar:OmnibarComponent;

    events: Event[] = [];
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
        this.modEnabled = this.api.isModuleEnabled('events.stream');
        this.events = events; 
        this.sortService.sort(this.events, this.sort)
    }

    btnFor(event : Event) : string {
        if( event.tag == 'wifi.client.handshake' )
            return 'danger';

        let tag = event.tag.split('.')[0];
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
