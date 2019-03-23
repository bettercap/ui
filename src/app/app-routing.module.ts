import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';

import { EventsTableComponent } from './components/events-table/events-table.component';
import { LanTableComponent } from './components/lan-table/lan-table.component';
import { WifiTableComponent } from './components/wifi-table/wifi-table.component';
import { BleTableComponent } from './components/ble-table/ble-table.component';
import { HidTableComponent } from './components/hid-table/hid-table.component';
import { CapletsComponent } from './components/caplets/caplets.component';
import { AdvancedComponent } from './components/advanced/advanced.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },

    { path: 'events', component: EventsTableComponent, canActivate: [AuthGuard]},
    { path: 'lan', component: LanTableComponent, canActivate: [AuthGuard]},
    { path: 'ble', component: BleTableComponent, canActivate: [AuthGuard]},
    { path: 'wifi', component: WifiTableComponent,  canActivate: [AuthGuard]},
    { path: 'hid', component: HidTableComponent,  canActivate: [AuthGuard]},
    { path: 'caplets', component: CapletsComponent,  canActivate: [AuthGuard]},
    { path: 'advanced', component: AdvancedComponent,  canActivate: [AuthGuard]},
    { path: 'advanced/:module', component: AdvancedComponent,  canActivate: [AuthGuard]},

    { path: '**', redirectTo: 'events' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
