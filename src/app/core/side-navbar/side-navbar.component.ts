import { Component, OnInit, Input, NgZone } from '@angular/core';
import * as navigationJsonMap from '@assets/json/navigation.json';
import { AuthService } from '@core/auth/auth.service';
import { Observable } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AppConstants, CacheStates } from '@core/constants/app.constant';
import { FirmwareCheckService } from '../../configuration/firmware/firmware-check.service';
@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent implements OnInit {
  $isAdmin: Observable<boolean> = this.authService.subscribeAdminAuth();
  navigationJson = navigationJsonMap['default'];
  adminIconSrc = 'assets/images/svg/navigation/ic-admin.svg';
  toolTipDelay = 800;
  toolTipClass = 'navigation-tooltip';
  toolTipPosition = 'right';
  navgiationList = this.navigationJson;
  hideTooltip: boolean;
  isUpToDate: boolean;

  constructor(
    public mediaObserver: MediaObserver,
    private authService: AuthService,
    private firmwareCheckService: FirmwareCheckService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.mediaObserver
      .asObservable()
      .pipe()
      .subscribe((mediaChange: MediaChange[]) => {
        if (mediaChange[0].mqAlias === 'lg' || mediaChange[0].mqAlias === 'xl') {
          this.hideTooltip = true;
        } else {
          this.hideTooltip = false;
        }
      });
    this.checkForUpdate();
  }

  checkForUpdate() {
    this.firmwareCheckService.isFirmwareUpToDate().subscribe((firmwareStatus: Object) => {
      this.ngZone.run(() => {
        this.isUpToDate = firmwareStatus[AppConstants.APP_DATA_KEYS.IS_UP_TO_DATE_KEY];
      });
    });
  }
}
