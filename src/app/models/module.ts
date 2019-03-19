export interface Module {
    name: string;
    description: string;
    author: string;
    parameters: any;
    running: boolean;
    state: any;
    handlers: any[];
}
