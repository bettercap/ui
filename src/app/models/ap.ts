import {Meta} from './meta';
import {Client} from './client';

export interface Ap {
  ipv4: string;
  ipv6: string;
  mac: string;
  hostname: string;
  alias: string;
  vendor: string;
  first_seen: string;
  last_seen: string;
  meta: Meta;
  frequency: number;
  rssi: number;
  sent: number;
  received: number;
  encryption: string;
  cipher: string;
  authentication: string;
  clients: Client[];
}
