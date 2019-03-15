import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'size'})
export class SizePipe implements PipeTransform {
    private units = [
        'b',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];

    transform(bytes: number = 0, precision: number = 2 ) : string {
        let sbytes = String(bytes)
            
        if( isNaN(parseFloat(sbytes)) || !isFinite(bytes) )
            return sbytes;
        else if( bytes == 0 )
            return "";

        let unit = 0;
        while ( bytes >= 1024 ) {
            bytes /= 1024;
            unit ++;
        }
        return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
    }
}
