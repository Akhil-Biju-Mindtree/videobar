import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ServiceAdapter } from 'app/providers/service-adapter';
import { AppIconConstants, AppConstants, ALL_UUID } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const ADMIN_ICON = AppIconConstants.ADMIN_ICON;

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
})
export class AdminNavComponent implements OnInit, OnDestroy {
  isAdmin; // using this variable in order to toggle admin State
  @Input() isAdminIconHidden;
  isDeviceAttached;
  subscribeRetrieveDone = false;
  svgAdmin = ADMIN_ICON;
  tooltipDisable = false;
  unsubscribe: Subject<any> = new Subject();

  constructor(
    private serviceAdapter: ServiceAdapter,
    private deviceManagerService: DeviceDataManagerService,
    private mediaObserver: MediaObserver,
  ) {}
  ngOnInit() {
    this.deviceStatus();
    this.mediaObserver.asObservable().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.tooltipDisable = this.mediaObserver.isActive('lg') || this.mediaObserver.isActive('xl');
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  deviceStatus() {
    this.serviceAdapter.getDeviceConnectionStatus.pipe(takeUntil(this.unsubscribe)).subscribe((device: string) => {
      if (device === 'attach') {
        this.isDeviceAttached = true;
      } else {
        this.isDeviceAttached = false;
      }
    });
  }

  subscribeAllDeviceComponent() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Subscribe, ALL_UUID);
  }

  retrieveAllDeviceComponent() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, ALL_UUID);
  }
}
