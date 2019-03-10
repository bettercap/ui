import {EventEmitter, Injectable, Output} from '@angular/core';
import {Session} from '../models/session';
import {Module} from '../models/module';
import {Host} from '../models/host';
import {Device} from '../models/device';
import {Ap} from '../models/ap';

@Injectable({
  providedIn: 'root'
})
export class SessionStoreService {
  @Output() sessionReadyEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectedProtocolEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectedModuleEvent: EventEmitter<any> = new EventEmitter();

  private session: Session;

  selectedProtocol: string;
  selectedModule: string;

  constructor() {
    this.session = null;
    this.selectedProtocol = 'lan';
    this.selectedModule = null;
  }

  async init(session) {
    this.session = await session;
    const _this = this.session;
    console.log(this.session);
    this.session.lan.hosts.forEach(function(el) {
      for (let prop in _this.packets.Traffic) {
        if (_this.packets.Traffic.hasOwnProperty(prop) && prop === el.ipv4) {
          el.packets = _this.packets.Traffic[prop];
        }
      }
    });
    this.sessionReadyEvent.emit('sessionReady');
  }
  getSession(): Session {
    return this.session;
  }
  getHosts(): Host[] {
    return this.session.lan.hosts;
  }
  getModules(): Module[] {
    return this.session.modules;
  }
  getBle(): Device[] {
    return this.session.ble.devices;
  }
  getWifi(): Ap[] {
    return this.session.wifi.aps;
  }
  switchProtocol(protocol: string): void {
    this.selectedProtocol = protocol;
    this.selectedModule = null;
    this.selectedProtocolEvent.emit('protocolChanged');
  }
  switchModule(module: string): void {
    this.selectedModule = module;
    this.selectedProtocol = null;
    this.selectedModuleEvent.emit('moduleChanged');
  }
}
