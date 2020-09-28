import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { ADMIN_CONST } from 'app/admin/admin.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AuthService } from '@core/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants } from '@core/constants/app.constant';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { UtilitiesService } from '@core/services/utilities.service';
import { INPUT_ERRORS } from '@core/error/error.constants';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AppConfig } from '@environment/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  uuid = ADMIN_CONST.UUID;
  unSubscribe = new Subject<void>();
  isAdmin = false;
  currentPassword: string;
  loginForm = new FormGroup({});
  incorrectPassword: boolean;
  attemptPassword: boolean;
  passwordLength = ADMIN_CONST.PASSWORD_MAX_LENGTH;
  passwordRegex = ADMIN_CONST.PASSWORD_REGEX;
  invalidPasswordMsg = INPUT_ERRORS.INVALID_PASSWORD_ERROR;
  attemptPasswordMsg = INPUT_ERRORS.ATTEMPT_PASSWORD_ERROR;
  isDeviceDataRetrived: boolean;
  redirectToFirware;
  count = 0;
  isSubmitButtonDisabled = true;
  isDesktopApp = AppConfig.isDesktopApp;
  isPasswordShown: boolean;
  passwordValue: string;

  constructor(
    private deviceMangerService: DeviceDataManagerService,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private utilitiesService: UtilitiesService,
    private applicationDataManagerService: ApplicationDataManagerService,
  ) {}

  ngOnInit() {
    this.onInitSubscribe();
  }

  onInitSubscribe() {
    this.authService
      .subscribeAdminAuth()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.zone.run(() => {
          this.isAdmin = value;
        });
      });
    this.applicationDataManagerService
      .listenForAppData(AppConstants.DEVICEDATA_RETRIEVED)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.isDeviceDataRetrived = value;
      });
    this.applicationDataManagerService
      .listenForAppData(AppConstants.REDIRECT_TO_FIRMWARE_KEY)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((value: boolean) => {
        this.redirectToFirware = value;
      });
  }

  ngAfterViewInit() {
    this.subscribeFormState();
  }

  subscribeFormState() {
    this.loginForm.statusChanges.pipe(takeUntil(this.unSubscribe)).subscribe(() => {
      setTimeout(() => {
        this.isSubmitButtonDisabled =
          this.loginForm.status !== AppConstants.VALID && !this.loginForm.hasError('incorrect');
      });
    });
  }

  updatePassword(value) {
    this.currentPassword = this.utilitiesService.generateMd5Hash(value);
  }

  login() {
    this.authService.login(this.currentPassword).pipe(takeUntil(this.unSubscribe)).subscribe((res: any) => {
      if (res) {
        this.routeAfterAuthenticate();
        if (AppConfig.isDesktopApp && !this.authService.getCacheInitialized()) {
          this.authService.initializeCache().subscribe(() => {});
        }
      } else {
        this.zone.run(() => {
          this.count = this.count + 1;
          if (this.count >= ADMIN_CONST.TEXT.ATTEMPT_COUNT) {
            this.attemptPassword = true;
          } else {
            this.incorrectPassword = true;
          }
          this.loginForm.setErrors({ incorrect: true });
          this.loginForm.markAsTouched();
        });
      }
    });
  }

  routeAfterAuthenticate() {
    this.zone.run(() => {
      if (!this.redirectToFirware) {
        this.router.navigateByUrl('/status');
      } else {
        this.router.navigateByUrl('/configuration/firmware');
        this.applicationDataManagerService.saveToAppData({ RedirectToFirmware: false });
      }
    });
  }

  logout() {
    this.authService.setAdminAccess(false);
    this.deviceMangerService.sendToDevice(AppConstants.Action.Retrieve, AppConstants.HOME_SCREEN_UUIDS);
    if (AppConfig.isDesktopApp) {
      this.router.navigateByUrl('/camera');
    }
  }

  onCancel() {
    this.router.navigateByUrl('/camera');
  }

  isInvalid() {
    return this.loginForm.touched && this.loginForm.dirty && this.loginForm.hasError('incorrect');
  }

  onCheckShowPassword() {
    this.zone.run(() => {
      this.passwordValue = this.loginForm.get(this.uuid.SYSTEM_PASSWORD).value;
      if (this.passwordValue !== '') {
        this.loginForm.markAsTouched();
        this.loginForm.markAsDirty();
      }
      const hasError = this.loginForm.hasError('incorrect');
      this.loginForm.get(this.uuid.SYSTEM_PASSWORD).updateValueAndValidity();
      this.isPasswordShown = !this.isPasswordShown;
      if (hasError) {
        setTimeout(() => {
          this.loginForm.setErrors({ incorrect: true });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.applicationDataManagerService.saveToAppData({ RedirectToFirmware: false });
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
