import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'hydra-frequency-indicator',
  templateUrl: './frequency-indicator.component.html',
  styleUrls: ['./frequency-indicator.component.scss']
})
export class FrequencyIndicatorComponent implements OnChanges {
  @Input() frequencyValue: number;

  frequency: string;

  constructor() {
    this.frequency = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.frequencyValue) {
      this.frequency = this._calculateFrequency(changes.frequencyValue.currentValue);
    }
  }

  private _calculateFrequency(frequencyValue: number): string {
    let frequency;
    if (frequencyValue.toString().charAt(0) === '2') {
      frequency = '2.4GHz';
    } else {
      frequency = '5.0GHz';
    }
    return frequency;
  }

}
