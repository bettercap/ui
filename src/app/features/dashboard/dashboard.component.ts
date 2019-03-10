import { Component } from '@angular/core';
import {SessionStoreService} from '../../core/services/session-store.service';

@Component({
  selector: 'hydra-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(public store: SessionStoreService) {
  }
  onLogout(event) {
    console.log(event);
  }
}
