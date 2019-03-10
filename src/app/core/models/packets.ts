import {Stats} from './stats';
import {Protos} from './protos';
import {IpAddress} from './ip-address';

export interface Packets {
  Stats: Stats;
  Protos: Protos;
  Traffic: IpAddress;
}
