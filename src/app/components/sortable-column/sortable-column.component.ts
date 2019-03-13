import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import {SortService} from '../../services/sort.service';

@Component({
    selector: '[sortable-column]',
    templateUrl: './sortable-column.component.html'
})
export class SortableColumnComponent implements OnInit {

    constructor(private sortService: SortService) { }

    @Input('sortable-column')
    columnName: string;

    @Input('sort-direction')
    sortDirection: string = '';

    @Input('sort-type')
    sortType: string = '';

    @HostListener('click')
    sort() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.sortService.emitSort({
            field: this.columnName,
            direction: this.sortDirection,
            type: this.sortType,
        });
    }

    ngOnInit() {
        // subscribe to sort changes so we can react when other columns are sorted
        this.sortService.onSort.subscribe(event => {
            // reset this column's sort direction to hide the sort icons
            if (this.columnName != event.field) {
                this.sortDirection = '';
            }
        });
    }

    ngOnDestroy() {
    }
}

