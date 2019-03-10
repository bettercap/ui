import {Component} from '@angular/core';
import {SessionStoreService} from '../../../core/services/session-store.service';
import {Host} from '../../../core/models/host';
import {faInfo} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hydra-lan-table',
  templateUrl: './lan-table.component.html',
  styleUrls: ['./lan-table.component.scss']
})
export class LanTableComponent {
  hosts: Host[];

  faInfo = faInfo;

  constructor(public store: SessionStoreService) {
    this.hosts = store.getHosts();
    console.log(this.hosts);
  }

}
