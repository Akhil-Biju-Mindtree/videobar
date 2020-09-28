import { Component, OnInit, OnDestroy } from '@angular/core';
import { NetworkConstant, WIRED_IP_STATIC_ITEMS, IP_CONFIGURATION_ITEMS } from '../network.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '@angular/router';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-wired',
  templateUrl: './wired.component.html',
  styleUrls: ['./wired.component.scss'],
})
export class WiredComponent implements OnInit, OnDestroy {
  ipConfigurationValues: { text: string; value: string; abandonEmit?: boolean }[];
  isWiredEnabled: boolean;
  ipStatic: { label: string; uuid: string; isRequired: boolean; value: string }[] = [];
  ipSettingUUID = NetworkConstant.UUID.WIRED;

  ethernetIcon: string;

  wiredStatusUUID = NetworkConstant.UUID.STATUS_BEHAVIOR_ETHERNET;
  connectionStatusStateUUID = NetworkConstant.UUID.STATUS_STATE;

  connectionStatus: string;
  isWebsocketDisconnected: boolean;
  unSubscribe = new Subject<void>();

  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private applicationDataManagerService: ApplicationDataManagerService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.ipConfigurationValues = IP_CONFIGURATION_ITEMS;
    this.ipStatic = WIRED_IP_STATIC_ITEMS;
    this.ethernetIcon = NetworkConstant.ICON.ETHERNET;
    if (!AppConfig.isDesktopApp) {
      this.applicationDataManagerService
        .listenForAppData(AppConstants.WEBSOCKET_DISCONNECTED)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((value: boolean) => {
          this.isWebsocketDisconnected = value;
          if (value && !this.isWiredEnabled) {
            this.authService.setAdminAccess(false);
            this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, AppConstants.HOME_SCREEN_UUIDS);
            this.router.navigateByUrl('/login');
          }
        });
    }
  }

  onToggleWiredStatus(event) {
    this.isWiredEnabled = event;
  }

  onStatusChange(status) {
    this.connectionStatus = status;
  }

  ngOnDestroy() {
    if (this.unSubscribe) {
      this.unSubscribe.next();
      this.unSubscribe.complete();
    }
  }
}
