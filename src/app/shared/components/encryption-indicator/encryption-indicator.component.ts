import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {faUnlock} from '@fortawesome/free-solid-svg-icons/faUnlock';

@Component({
  selector: 'hydra-encryption-indicator',
  templateUrl: './encryption-indicator.component.html',
  styleUrls: ['./encryption-indicator.component.scss']
})
export class EncryptionIndicatorComponent implements OnChanges {
  @Input() encryptionValue: string;

  encryption: string;
  faUnlock = faUnlock;

  constructor() {
    this.encryption = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.encryptionValue) {
      this.encryption = this._calculateEncryption(changes.encryptionValue.currentValue);
    }
  }

  private _calculateEncryption(encryptionValue: string): string {
    return encryptionValue.toUpperCase();
  }

}
