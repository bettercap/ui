import {Component, OnInit, OnDestroy} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { Event } from '../../models/event';

@Component({
    selector: 'hydra-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit, OnDestroy {
    events: Event[];
    sort: ColumnSortedEvent;
    sortSub: any;
    query: string = '';

    constructor(private api: ApiService, private sortService: SortService) { 
        this.sort = {field: 'time', direction: 'asc', type:''};
        this.update(this.api.events);
    }

    ngOnInit() {
        this.api.onNewEvents.subscribe(events => {
            this.update(events);
        });

        this.sortSub = this.sortService.onSort.subscribe(event => {
            this.sort = event;
            this.sortService.sort(this.events, event);
        });
    }

    ngOnDestroy() {
        this.sortSub.unsubscribe();
    }

    private update(events) {
        this.events = events; 
        this.sortService.sort(this.events, this.sort)
    }

    clear() {
        this.api.clearEvents();
        this.events = [];
    }
}
