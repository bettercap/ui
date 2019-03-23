import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'modicon'})
export class ModIconPipe implements PipeTransform {
    transform(name: string): string {
        if( name == 'caplets' )
            return 'scroll';

        else if( name == 'hid' )
            return 'keyboard';

        else if( name == 'wifi' )
            return 'wifi';

        else if( name == 'gps' )
            return 'globe';

        else if( name == 'update' )
            return 'download';

        else if( name.indexOf('proxy') != -1 )
            return 'filter';

        else if( name.indexOf('server') != -1 )
            return 'server';

        else if( name.indexOf('recon') != -1 )
            return 'eye';

        else if( name.indexOf('spoof') != -1 )
            return 'radiation';

        else if( name.indexOf('net.') === 0 )
            return 'network-wired';

        return 'tools';
    } 
}
