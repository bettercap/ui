import {Time} from './time';

export interface Gps {
  Type: string;
  Fields?: any;
  Checksum: string;
  Raw: string;
  Time: Time;
  Latitude: number;
  Longitude: number;
  FixQuality: string;
  NumSatellites: number;
  HDOP: number;
  Altitude: number;
  Separation: number;
  DGPSAge: string;
  DGPSId: string;
}
