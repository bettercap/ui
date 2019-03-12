import {HostMeta} from './host-meta';
import {IpAddress} from './ip-address';

export interface Host {
  ipv4: string;
  ipv6: string;
  mac: string;
  hostname: string;
  alias: string;
  vendor: string;
  first_seen: string;
  last_seen: string;
  meta: HostMeta;
  packets?: IpAddress;
}
