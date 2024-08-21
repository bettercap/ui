import { Option } from './option';
import { Interface } from './interface';
import { Env } from './env';
import { Lan } from './lan';
import { Wifi } from './wifi';
import { Ble } from './ble';
import { HID } from './hid';
import { CAN } from './can';
import { Packets } from './packets';
import { Gps } from './gps';
import { Module } from './module';

export interface Session {
    version: string;
    os: string;
    arch: string;
    goversion: string;
    resources: any;
    options: Option;
    interface: Interface;
    interfaces: any[];
    gateway: Interface;
    env: Env;
    lan: Lan;
    wifi: Wifi;
    ble: Ble;
    hid: HID;
    can: CAN;
    packets: Packets;
    started_at: string;
    polled_at: string;
    active: boolean;
    gps: Gps;
    modules: Module[];
}
