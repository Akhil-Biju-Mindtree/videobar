import { Injectable, Injector } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { ADMIN_CONST } from 'app/admin/admin.constant';
import { CachingService } from '@core/services/caching.service';
import { CookieService } from 'ngx-cookie-service';
import { AutoLogoutService } from '@core/auth/auto-logout.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants, ALL_UUID, CacheStates } from '@core/constants/app.constant';
import { AppSpinnerModel } from '@shared/components/app-spinner/app-spinner.model';
import { SpinnerService } from '@shared/components/app-spinner/app-spinner.service';
import { MapperService } from '@core/services/mapper.service';
import { AppConfig } from '@environment/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { Idle } from '@ng-idle/core';
import { AppCheckService } from 'app/settings/app-check.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isCacheInitialized = false;
  private password = '';
  private isAuthenticated = false;
  private deviceManagerService;

  setCacheInitialized(value) {
    this.isCacheInitialized = value;
  }

  getCacheInitialized() {
    return this.isCacheInitialized;
  }

  constructor(
    private applicationDataManagerService: ApplicationDataManagerService,
    private cachingService: CachingService,
    private cookieService: CookieService,
    private injector: Injector,
    private spinnerService: SpinnerService,
    private mapperService: MapperService,
    private appCheckService: AppCheckService,
    private router: Router,
  ) {}

  /**
   * This method subscribes for password and authentication status changes
   * Typically, this method should be invoked as soon as the application initialized
   * Do not call this method more than once
   */
  subscribeCredentials() {
    this.cachingService.getFromCache(ADMIN_CONST.UUID.SYSTEM_PASSWORD).subscribe((value: string) => {
      this.password = value;
      if (!AppConfig.isDesktopApp && this.password) {
        if (this.cookieService.check(AppConstants.APP_SESSION)) {
          this.cookieService.delete(AppConstants.APP_SESSION);
        }
        this.cookieService.set(AppConstants.APP_SESSION, this.password);
      }
    });
    this.applicationDataManagerService.listenForAppData(AppConstants.AUTHENTICATED).subscribe((value: boolean) => {
      this.isAuthenticated = value;
    });
    this.applicationDataManagerService
      .listenForAppData(AppConstants.DEVICEDATA_RETRIEVED)
      .subscribe((value: boolean) => {
        this.isCacheInitialized = value;
      });
  }

  /**
   * It provides admin password string
   */
  get Password() {
    return this.password;
  }

  /**
   * It provides status of admin login at a given point in time
   */
  get IsAuthenticated() {
    return this.isAuthenticated;
  }

  public setAdminAccess(permission: boolean) {
    this.applicationDataManagerService.saveToAppData({ [AppConstants.AUTHENTICATED]: permission });
    if (!permission) {
      this.cachingService.clearCache();
      this.cookieService.deleteAll();
      const idle = this.injector.get(Idle);
      idle.stop();
    }
  }

  /**
   * This method provides observable that will emit the admin access as and when it is changed
   */
  public subscribeAdminAuth(): Observable<boolean> {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUTHENTICATED);
  }

  initializeCache(): Observable<boolean> {
    const appSpinnerModel = new AppSpinnerModel();
    appSpinnerModel.title = ADMIN_CONST.LOADING_TEXT_TITLE;
    const cacheInit$ = zip(this.subscribeAllDeviceComponent(), this.retrieveAllDeviceComponent());
    this.spinnerService.openSpinnerDialog(appSpinnerModel);
    return cacheInit$.pipe(
      tap(() => {
        this.applicationDataManagerService.saveToAppData({ [AppConstants.DEVICEDATA_RETRIEVED]: true });
        this.spinnerService.closeSpinnerDialog();
        this.appCheckService.checkApp();
      }),
      map(() => {
        return true;
      }),
    );
  }
  subscribeAllDeviceComponent(): Observable<any> {
    return this.deviceManagerService.sendToDevice(AppConstants.Action.SubscribeAll, ALL_UUID);
  }

  retrieveAllDeviceComponent(): Observable<any> {
    return this.deviceManagerService.sendToDevice(AppConstants.Action.Retrieve, ALL_UUID);
  }

  login(value, guard?) {
    const passwordConfig = this.mapperService.findObjectFromJSONMapper(ADMIN_CONST.UUID.SYSTEM_PASSWORD);
    const command_id = passwordConfig.command_id;
    const canonicalName = passwordConfig.canonical_name;
    const groupName = canonicalName.split('.').shift();
    this.deviceManagerService = this.injector.get(DeviceDataManagerService);
    return this.deviceManagerService
      .sendToDevice(AppConstants.Action.Authenticate, {
        [ADMIN_CONST.UUID.SYSTEM_PASSWORD]: value,
      })
      .pipe(
        map((res: any) => {
          if (res[groupName][command_id].codePointAt(0).toString(16) === ADMIN_CONST.TEXT.INCORRECT_PASSWORD) {
            if (!AppConfig.isDesktopApp && guard) {
              this.router.navigateByUrl('/login');
            }
            return false;
          }
          if (!AppConfig.isDesktopApp) {
            this.cookieService.set(AppConstants.APP_SESSION, this.password);
          }

          this.applicationDataManagerService.saveToAppData({ [AppConstants.AUTHENTICATED]: true });
          const autoLogoutService = this.injector.get(AutoLogoutService);
          autoLogoutService.autoLogOutIdleWatcher();
          return true;
        }),
      );
  }
}
