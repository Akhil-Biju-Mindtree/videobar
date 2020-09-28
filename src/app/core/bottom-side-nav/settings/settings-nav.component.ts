import { Component, OnInit, Input } from '@angular/core';
import { AppConstants, AppIconConstants } from '@core/constants/app.constant';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppConfig } from '@environment/environment';
import { MediaObserver } from '@angular/flex-layout';
@Component({
  selector: 'app-settings-nav',
  templateUrl: './settings-nav.component.html',
  styleUrls: ['./settings-nav.component.scss'],
})
export class SettingsNavComponent implements OnInit {
  @Input() isDeviceAttached;
  @Input() isAdmin: boolean;
  settingsIcon = AppIconConstants.SETTINGS_ICON;
  toolTipDelay = AppConstants.ToolTipDelay;
  toolTipPosition = AppConstants.RIGHT;
  shownBackBtn;
  backBtnIcon: string;
  backBtnToolTip: string;
  showSettingIcon = true;
  isDesktopApp = AppConfig.isDesktopApp;
  tooltipDisable = false;
  constructor(private router: Router, private mediaObserver: MediaObserver) {
    if (this.isDesktopApp) {
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/camera' || event.urlAfterRedirects === '/discovery') {
          this.shownBackBtn = false;
        } else {
          this.shownBackBtn = true;
        }

        if (this.isDeviceAttached) {
          this.backBtnIcon = AppIconConstants.BACK_HOME_ICON;
          this.backBtnToolTip = AppConstants.CAMERA_CONTROLS;
          this.showSettingIcon = true;
        } else {
          this.backBtnIcon = AppIconConstants.BACK_ICON;
          this.backBtnToolTip = AppConstants.BACK;
          if (event.url === '/settings') {
            this.showSettingIcon = false;
          } else {
            this.showSettingIcon = true;
          }
        }
      });
    }
  }

  ngOnInit() {
    this.mediaObserver.asObservable().subscribe(() => {
      this.tooltipDisable = this.mediaObserver.isActive('lg') || this.mediaObserver.isActive('xl');
    });
  }

  navigateHomeScreen() {
    if (this.isDeviceAttached) {
      this.router.navigateByUrl('/camera');
    } else {
      this.router.navigateByUrl('/discovery');
    }
  }
}
