import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'hydra-signal-indicator',
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

  private _calculateStrength(value: number): number {
    let result: number;
    if (value <= -90) {
      result = 1;
    } else if (value < -55) {
      result = 2;
    } else if (value >= -55 && value < -30) {
      result = 3;
    } else if (value >= -30) {
      result = 4;
    }
    return result;
  }

}
