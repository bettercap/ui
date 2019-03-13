import {Injectable, EventEmitter} from '@angular/core';

export interface ColumnSortedEvent {
    field: string;
    direction: string;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class SortService {
    constructor() { }

    public onSort: EventEmitter<ColumnSortedEvent> = new EventEmitter();

    emitSort(event: ColumnSortedEvent) {
        this.onSort.emit(event);
    }

    sort(array: any[], how: ColumnSortedEvent) {
        // console.log("sorting " + array.length + " elements", how);
        let less = 1;
        let greater = -1;
        if( how.direction == 'desc' ) {
            less = -1;
            greater = 1;
        }

        if( how.type == 'ip' ) {
            array.sort((a,b) => {
                a = a[how.field].split( '.' );
                b = b[how.field].split( '.' );
                for( var i = 0; i < a.length; i++ ) {
                    if( ( a[i] = parseInt( a[i] ) ) < ( b[i] = parseInt( b[i] ) ) )
                        return less;
                    else if( a[i] > b[i] )
                        return greater;
                }
                return 0;
            });
        } else {
            array.sort((a,b) => a[how.field] < b[how.field] ? less : a[how.field] > b[how.field] ? greater : 0);
        } 
    }
}

