import {Meta} from './meta';

export interface Interface {
  ipv4: string;
  ipv6: string;
  mac: string;
  hostname: string;
  alias: string;
  vendor: string;
  first_seen: string;
  last_seen: string;
  meta: Meta;
}
