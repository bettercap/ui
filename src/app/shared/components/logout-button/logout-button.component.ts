import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hydra-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent {
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();
  faSignOutAlt = faSignOutAlt;
  logout() {
    this.logoutEvent.emit('logout');
  }
}
