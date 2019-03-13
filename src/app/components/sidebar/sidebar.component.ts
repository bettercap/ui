import {Component, OnInit} from '@angular/core';

import {ApiService} from '../../services/api.service';
import {Module} from '../../models/module';

import {faCircle, faNetworkWired, faQuestion, faUserCog, faWifi} from '@fortawesome/free-solid-svg-icons';
import {faBluetoothB} from '@fortawesome/free-brands-svg-icons/faBluetoothB';
import {faTerminal} from '@fortawesome/free-solid-svg-icons/faTerminal';

@Component({
    selector: 'hydra-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    modules: Module[];

    faTerminal = faTerminal;
    faLan = faNetworkWired;
    faWiFi = faWifi;
    faBluetooth = faBluetoothB;
    faCircle = faCircle;
    faUserCog = faUserCog;
    faQuestion = faQuestion;

    constructor(private api: ApiService) { 
        this.update(this.api.session.modules);
    }

    toggleModule(module: any): void {
        console.log("toggling module " + module.name);
        this.api.cmd(module.name + " " + (module.running ? 'off' : 'on'));
    }

    ngOnInit() {
        this.api.onNewData.subscribe(session => {
            this.update(session.modules);
        });
    }

    private update(modules) {
        this.modules = modules; 
    }
}
