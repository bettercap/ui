import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Session} from '../../../core/models/session';

@Component({
  selector: 'hydra-view-container',
  templateUrl: './view-container.component.html',
  styleUrls: ['./view-container.component.scss']
})
export class ViewContainerComponent implements OnChanges{
  @Input() session: Session;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.session.firstChange) {
      this.session = changes.session.currentValue;
    }
  }

}
