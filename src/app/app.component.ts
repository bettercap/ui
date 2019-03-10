import {Component, EventEmitter, Output} from '@angular/core';
import {SessionService} from './core/services/session.service';
import {SessionStoreService} from './core/services/session-store.service';

@Component({
  selector: 'hydra-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();

  terminalStatus: boolean;

  constructor(
      public actions: SessionService,
      public store: SessionStoreService
  ) {
    this.terminalStatus = false;
  }

  changeTerminalStatus() {
    this.terminalStatus = !this.terminalStatus;
  }

  logout() {
    this.logoutEvent.emit('logout');
    console.log(`[LOGOUT] Emitted from AppComponent`);
  }
}
