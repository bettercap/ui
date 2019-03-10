import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionStoreService} from '../../../core/services/session-store.service';
import {faCircle, faNetworkWired, faQuestion, faUserCog, faWifi} from '@fortawesome/free-solid-svg-icons';
import {faBluetoothB} from '@fortawesome/free-brands-svg-icons/faBluetoothB';
import {Module} from 'src/app/core/models/module';
import {Session} from 'src/app/core/models/session';
import {faTerminal} from '@fortawesome/free-solid-svg-icons/faTerminal';

@Component({
  selector: 'hydra-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() session: Session;
  @Output() terminalEvent: EventEmitter<any> = new EventEmitter();

  modules: Module[];

  faTerminal = faTerminal;
  faLan = faNetworkWired;
  faWiFi = faWifi;
  faBluetooth = faBluetoothB;
  faCircle = faCircle;
  faUserCog = faUserCog;
  faQuestion = faQuestion;

  constructor(public store: SessionStoreService) {
    this.modules = store.getModules();
  }

  switchModule(module: string): void {
    this.store.switchModule(module);
  }
  toggleModuleRunning(module: any): void {
    module.running = !module.running;
  }
  toggleTerminal(): void {
    this.terminalEvent.emit('terminalStatusChange');
  }
  toggleOptionPanel(): void {

  }
}
