import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'hydra-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent {
  @Input() terminalStatus: boolean;
  @Output() terminalEvent: EventEmitter<any> = new EventEmitter();

  commandIndex: number;
  // hidden: boolean;
  currentLine: string;
  totalLine: CommandLine[];
  lastLogin: string;
  sendCommand: boolean;

  constructor() { }

  toggleTerminal(): void {
    this.terminalStatus = !this.terminalStatus;
    this.terminalEvent.emit('terminalStatusChange');
  }

}

export interface CommandLine {
  command: string;
  message: string;
}
