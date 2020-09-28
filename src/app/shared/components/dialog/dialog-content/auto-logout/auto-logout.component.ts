import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog.component';
import { timer, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { AppConstants } from '@core/constants/app.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { ADMIN_CONST } from 'app/admin/admin.constant';

@Component({
  selector: 'app-auto-logout',
  templateUrl: './auto-logout.component.html',
  styleUrls: ['./auto-logout.component.scss'],
})
export class AutoLogoutComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({});
  countDownTime = ADMIN_CONST.TEXT.AUTO_LOGOUT_COUNT_DOWN;
  timeCountDown;
  subscription: Subscription;
  timeFormat = ADMIN_CONST.TEXT.MINUTES;
  loginSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private authService: AuthService,
    private deviceDataManagerService: DeviceDataManagerService,
    private router: Router,
    private idle: Idle,
  ) {}

  ngOnInit() {
    this.subscription = timer(0, 1000)
      .pipe(
        take(this.countDownTime),
        tap(() => (this.countDownTime = this.countDownTime - 1)),
      )
      .subscribe(() => {
        this.timeCountDown = this.countDownTime;
        if (this.countDownTime === 59) {
          this.timeFormat = ADMIN_CONST.TEXT.SECONDS;
        }
        if (this.countDownTime === 0) {
          this.onCloseDialog();
        }
      });
    this.listenToLogout();
  }

  listenToLogout() {
    this.loginSubscription = this.authService.subscribeAdminAuth().subscribe((isLogin) => {
      if (!isLogin) {
        this.subscription.unsubscribe();
        this.dialogRef.close();
      }
    });
  }

  // On continue button click just to close the dailog
  onSubmitDialog() {
    this.idle.watch();
    this.dialogRef.close();
  }

  // logout button click
  onCloseDialog() {
    this.authService.setAdminAccess(false);
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Retrieve, AppConstants.HOME_SCREEN_UUIDS);
    this.router.navigateByUrl('/login');
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }
}
