import {Option} from './option';
import {Interface} from './interface';
import {Env} from './env';
import {Lan} from './lan';
import {Wifi} from './wifi';
import {Ble} from './ble';
import {Packets} from './packets';
import {Gps} from './gps';
import {Module} from './module';

export interface Session {
  options: Option;
  interface: Interface;
  gateway: Interface;
  env: Env;
  lan: Lan;
  wifi: Wifi;
  ble: Ble;
  packets: Packets;
  started_at: string;
  active: boolean;
  gps: Gps;
  modules: Module[];
}
