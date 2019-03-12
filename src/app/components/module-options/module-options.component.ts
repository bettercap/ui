import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Module} from '../../models/module';
import {Session} from '../../models/session';

@Component({
  selector: 'hydra-module-options',
  templateUrl: './module-options.component.html',
  styleUrls: ['./module-options.component.scss']
})
export class ModuleOptionsComponent {
  @Input() session: Session;

  module: Module;
  moduleName: string;

  constructor(activatedRoute: ActivatedRoute) {
    this.module = null;
    activatedRoute.params.subscribe(params => {
      this.moduleName = params.moduleName;
    });
  }

}
