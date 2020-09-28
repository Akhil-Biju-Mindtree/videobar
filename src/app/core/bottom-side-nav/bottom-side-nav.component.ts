import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppIconConstants } from '@core/constants/app.constant';
import { AuthService } from '@core/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConfig } from '@environment/environment';

const SETTINGS_ICON = AppIconConstants.SETTINGS_ICON;
@Component({
  selector: 'app-bottom-side-nav',
  templateUrl: './bottom-side-nav.component.html',
  styleUrls: ['./bottom-side-nav.component.scss'],
})
export class BottomSideNavComponent implements OnInit, OnDestroy {
  @Input() isAdminIconHidden;
  @Input() isDeviceAttached;
  isAdmin: boolean;
  svgSettings = SETTINGS_ICON;
  unSubscribe = new Subject();
  isDesktopApp = AppConfig.isDesktopApp;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscribeUserChange();
  }

  subscribeUserChange() {
    this.authService
      .subscribeAdminAuth()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.isAdmin = value;
      });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
