import { Component } from '@angular/core';
import {Ap} from '../../../core/models/ap';
import {SessionStoreService} from '../../../core/services/session-store.service';
import {faInfo} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hydra-wifi-table',
  templateUrl: './wifi-table.component.html',
  styleUrls: ['./wifi-table.component.scss']
})
export class WifiTableComponent {
  aps: Ap[];

  faInfo = faInfo;

  constructor(public store: SessionStoreService) {
    this.aps = store.getWifi();
  }

}
