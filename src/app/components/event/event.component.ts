import {Component, Input} from '@angular/core';
import { Event } from '../../models/event';

@Component({
    selector: 'event-data',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})
export class EventComponent {
    @Input() event: Event;

    private logLevels: string[] = [
        "DEBUG",
        "INFO",
        "IMPORTANT",
        "WARNING",
        "ERROR",
        "FATAL"
    ];

    constructor() { }

    get data() : string {
        return this.event.data;
    }

    logLevel(level : number) : string {
        return this.logLevels[level];
    }
}
