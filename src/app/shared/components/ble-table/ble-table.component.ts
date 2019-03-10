import { Component } from '@angular/core';
import {SessionStoreService} from '../../../core/services/session-store.service';
import {Device} from '../../../core/models/device';

@Component({
  selector: 'hydra-ble-table',
  templateUrl: './ble-table.component.html',
  styleUrls: ['./ble-table.component.scss']
})
export class BleTableComponent {
  ble: Device[];

  constructor(public store: SessionStoreService) {
    this.ble = store.getBle();
  }
}
