import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ConnectionDetectionService } from '@core/services/connection-detection.service';
import { takeUntil } from 'rxjs/operators';
import { AppConstants, APP_INFO } from '@core/constants/app.constant';
import { Logger } from '@core/logger/Logger';
import { HttpClientWrapperService } from '@core/services/http-client-wrapper.service';

@Injectable({
  providedIn: 'root',
})
export class AppCheckService {
  unsubscribe = new Subject<void>();
  currentAppVersion = APP_INFO.APP_VERSION.substring(
    8,
    APP_INFO.APP_VERSION.indexOf('_') !== -1 ? APP_INFO.APP_VERSION.indexOf('_') : APP_INFO.APP_VERSION.length,
  );
  latestAppVersion;
  noConnection = true;
  private isUpToDate: BehaviorSubject<Object> = new BehaviorSubject<Object>({
    isUpToDate: true,
    noConnection: true,
    details: null,
  });
  constructor(
    private connectionDetectionService: ConnectionDetectionService,
    private http: HttpClientWrapperService,
    private ngZone: NgZone,
    private loggerService: Logger,
  ) {
    if (navigator.onLine) {
      this.noConnection = false;
      this.checkApp();
    } else {
      this.noConnection = true;
      this.isUpToDate.next({ isUpToDate: true, noConnection: true, details: null });
    }
    this.checkForConnection();
  }

  private checkForConnection() {
    this.connectionDetectionService.getConnectionStatus().subscribe((connectionStatus: string) => {
      this.ngZone.run(() => {
        if (connectionStatus) {
          if (connectionStatus === AppConstants.ONLINE) {
            this.noConnection = false;
            this.checkApp();
          } else {
            this.noConnection = true;
            this.isUpToDate.next({ isUpToDate: true, noConnection: true, details: null });
          }
        }
      });
    });
  }

  public checkApp() {
    this.http.fetchVersionedLink(AppConstants.APP_INFO_URL).subscribe(
      (app_info: any) => {
        this.ngZone.run(() => {
          this.latestAppVersion = app_info.BWC.latestAppVersion;
          const appData = { ...app_info.BWC, pathVersion: app_info.requestVersion.replace(/\./g, '_') };
          if (this.compareAppVersion(this.currentAppVersion, this.latestAppVersion) < 0) {
            this.isUpToDate.next({ isUpToDate: false, noConnection: false, details: appData });
          } else {
            this.isUpToDate.next({ isUpToDate: true, noConnection: false, details: appData });
          }
        });
      },
      (error: any) => {
        this.loggerService.trace(`Could not connect to server::: ${JSON.stringify(error)}`);
      },
    );
  }

  compareAppVersion(v1, v2) {
    if (typeof v1 !== 'string') {
      return false;
    }
    if (typeof v2 !== 'string') {
      return false;
    }
    const v1parts = v1.split('.');
    const v2parts = v2.split('.');
    const k = Math.min(v1parts.length, v2parts.length);
    for (let i = 0; i < k; i = i + 1) {
      const v1n = parseInt(v1parts[i], 10);
      const v2n = parseInt(v2parts[i], 10);
      if (v1n > v2n) {
        return 1;
      }
      if (v1n < v2n) {
        return -1;
      }
    }
    return v1.length === v2.length ? 0 : v1.length < v2.length ? -1 : 1;
  }

  isAppUpToDate(): Observable<Object> {
    return this.isUpToDate.asObservable();
  }
}
