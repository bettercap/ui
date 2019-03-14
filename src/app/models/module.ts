import {Values} from './values';

export interface Module {
  name: string;
  description: string;
  author: string;
  parameters: any;
  running: boolean;
}
