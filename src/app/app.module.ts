import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { SortableColumnComponent } from './components/sortable-column/sortable-column.component';
import { LoginComponent } from './components/login/login.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
// import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EventsTableComponent } from './components/events-table/events-table.component';
import { LanTableComponent } from './components/lan-table/lan-table.component';
import { BleTableComponent } from './components/ble-table/ble-table.component';
import { HidTableComponent } from './components/hid-table/hid-table.component';
import { WifiTableComponent } from './components/wifi-table/wifi-table.component';
// import { ModuleOptionsComponent } from './components/module-options/module-options.component';
import { SignalIndicatorComponent } from './components/signal-indicator/signal-indicator.component';
// import { TerminalComponent } from './components/terminal/terminal.component';

@NgModule({
    declarations: [
        AppComponent,
        SortableColumnComponent,
        LoginComponent,
        MainHeaderComponent,
        // SidebarComponent,
        EventsTableComponent,
        LanTableComponent,
        BleTableComponent,
        HidTableComponent,
        WifiTableComponent,
        // ModuleOptionsComponent,
        SignalIndicatorComponent,
        // TerminalComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FontAwesomeModule,
        NgbModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
