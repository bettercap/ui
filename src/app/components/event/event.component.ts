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

    // https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings
    cleanBash(message : string) : string {
        return message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') ;
    }
}
