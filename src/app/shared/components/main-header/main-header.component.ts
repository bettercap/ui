import {Component, Output, EventEmitter} from '@angular/core';
import {faTerminal} from '@fortawesome/free-solid-svg-icons/faTerminal';

@Component({
  selector: 'hydra-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();

  headerHeight: number;

  constructor() {}

  logout() {
    this.logoutEvent.emit('logout');
  }
}
