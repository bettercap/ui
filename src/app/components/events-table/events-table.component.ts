import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SortService, ColumnSortedEvent } from '../../services/sort.service';
import { OmniBarService } from '../../services/omnibar.service';
import { Event } from '../../models/event';

declare var $: any;

@Component({
    selector: 'ui-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit, OnDestroy {
    events: Event[] = [];
    ignored: string[] = [];
    modEnabled: boolean = false;
    sort: ColumnSortedEvent;
    query: string = '';
    subscriptions: any = [];
    curEvent: any = null;

    constructor(private api: ApiService, private sortService: SortService, public omnibar: OmniBarService) {
        this.sort = { field: 'time', direction: 'asc', type: '' };
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
        for (let i = 0; i < this.subscriptions.length; i++) {
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

    btnFor(tag: string): string {
        if (tag == 'wifi.client.handshake')
            return 'danger';

        tag = tag.split('.')[0];
        switch (tag) {
            case 'can': return 'success';
            case 'wifi': return 'success';
            case 'endpoint': return 'secondary';
            case 'ble': return 'primary';
            case 'hid': return 'warning';
            default: return 'dark';
        }
    }

    showEvent(event: any) {
        this.curEvent = event;
        $('#eventModal').modal('show');
    }

    curEventData() {
        if (this.curEvent) {
            return JSON.stringify(this.curEvent.data, null, 2);
        }
        return '';
    }

    clear() {
        this.api.clearEvents();
        this.events = [];
    }

    toggleModule() {
        let toggle = this.api.module('events.stream').running ? 'off' : 'on';
        let enabled = toggle == 'on' ? true : false;
        this.api.cmd("events.stream " + toggle);
        this.modEnabled = enabled;
    }
}
