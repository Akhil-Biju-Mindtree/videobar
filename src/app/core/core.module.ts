import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavComponent } from './bottom-side-nav/admin/admin.-nav.component';
import { FooterComponent } from './footer/footer.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { DeviceDiscoveryComponent } from './device-discovery/device-discovery.component';
import { NGXLogger, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { logMapper } from './logger/logger-mapping';
import { AppConfig } from '@environment/environment';
import { RouterModule } from '@angular/router';
import { BottomSideNavComponent } from './bottom-side-nav/bottom-side-nav.component';
import { SettingsNavComponent } from './bottom-side-nav/settings/settings-nav.component';
import { WebsocketErrorNotificationComponent } from './websocket-error-notification/websocket-error-notification.component';

@NgModule({
  declarations: [
    AdminNavComponent,
    FooterComponent,
    NavbarComponent,
    PagenotfoundComponent,
    SideNavbarComponent,
    HeaderComponent,
    DeviceDiscoveryComponent,
    BottomSideNavComponent,
    SettingsNavComponent,
    WebsocketErrorNotificationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoggerModule.forRoot({
      level: logMapper[AppConfig.logLevel],
      serverLoggingUrl: '',
      serverLogLevel: logMapper.enableStorageLog,
    }),
    RouterModule,
  ],
  entryComponents: [WebsocketErrorNotificationComponent],
  exports: [SideNavbarComponent, BottomSideNavComponent],
})
export class CoreModule { }
