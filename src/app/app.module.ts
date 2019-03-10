import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SessionStoreService } from './core/services/session-store.service';
import { SessionService } from './core/services/session.service';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MainHeaderComponent } from './shared/components/main-header/main-header.component';
import { LogoutButtonComponent } from './shared/components/logout-button/logout-button.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { ViewContainerComponent } from './shared/components/view-container/view-container.component';
import { LanTableComponent } from './shared/components/lan-table/lan-table.component';
import { BleTableComponent } from './shared/components/ble-table/ble-table.component';
import { WifiTableComponent } from './shared/components/wifi-table/wifi-table.component';
import { ModuleOptionsComponent } from './shared/components/module-options/module-options.component';
import { SignalIndicatorComponent } from './shared/components/signal-indicator/signal-indicator.component';
import { FrequencyIndicatorComponent } from './shared/components/frequency-indicator/frequency-indicator.component';
import { EncryptionIndicatorComponent } from './shared/components/encryption-indicator/encryption-indicator.component';
import { TerminalComponent } from './core/components/terminal/terminal.component';

export function sessionProvider(provider: SessionService) {
  return () => provider.loadSession();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainHeaderComponent,
    LogoutButtonComponent,
    SidebarComponent,
    ViewContainerComponent,
    LanTableComponent,
    BleTableComponent,
    WifiTableComponent,
    ModuleOptionsComponent,
    SignalIndicatorComponent,
    FrequencyIndicatorComponent,
    EncryptionIndicatorComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [
    SessionService,
    SessionStoreService,
    { provide: APP_INITIALIZER, useFactory: sessionProvider, deps: [SessionService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
