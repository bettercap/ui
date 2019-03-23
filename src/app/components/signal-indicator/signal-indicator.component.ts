import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'ui-signal-indicator',
    templateUrl: './signal-indicator.component.html',
    styleUrls: ['./signal-indicator.component.scss']
})
export class SignalIndicatorComponent implements OnChanges {
    @Input() signalstrength: number;

    signal: number;

    constructor() {
        this.signal = 0;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.signalstrength) {
            this.signal = this._calculateStrength(changes.signalstrength.currentValue);
        }
    }

   	// ref. https://www.metageek.com/training/resources/understanding-rssi-2.html
    private _calculateStrength(value: number): number {
        if( value >= -67 )
            return 4;
        else if( value >= -70 )
            return 3;
        else if( value >= -80 )
            return 2;
        else
            return 1;
    }
}
