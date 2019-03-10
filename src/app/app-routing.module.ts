import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanTableComponent } from './shared/components/lan-table/lan-table.component';
import { WifiTableComponent } from './shared/components/wifi-table/wifi-table.component';
import { BleTableComponent } from './shared/components/ble-table/ble-table.component';
import { ModuleOptionsComponent } from './shared/components/module-options/module-options.component';

const routes: Routes = [
  { path: 'lan', component: LanTableComponent },
  { path: 'ble', component: BleTableComponent },
  { path: 'wifi', component: WifiTableComponent },
  { path: 'modules/:moduleName', component: ModuleOptionsComponent },
  { path: '**', redirectTo: 'lan' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
