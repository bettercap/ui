import {Meta} from './meta';

export interface Client {
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
}
