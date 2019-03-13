import {Component, OnInit} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Event } from '../../models/event';

@Component({
    selector: 'hydra-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit {
    events: Event[];

    constructor(private api: ApiService) { 
        this.update(this.api.events);
    }

    ngOnInit() {
        this.api.onNewEvents.subscribe(events => {
            this.update(events);
        });
    }

    private update(events) {
        this.events = events; 
        this.events.sort((a,b) => (a.time < b.time) ? 1 : (a.time > b.time) ? -1 : 0);
    }

    clear() {
        this.api.clearEvents();
        this.events = [];
    }
}
