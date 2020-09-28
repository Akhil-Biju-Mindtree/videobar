import { Injectable, Injector } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { AutoLogoutComponent } from '@shared/components/dialog/dialog-content/auto-logout/auto-logout.component';
import { ADMIN_CONST } from 'app/admin/admin.constant';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  constructor(private idle: Idle, private dialogService: DialogService, private injector: Injector) {
    this.idle.setIdle(ADMIN_CONST.TEXT.AUTO_LOGOUT_IDLE_TIME);
    this.idle.setTimeout(ADMIN_CONST.TEXT.AUTO_LOGOUT_SET_TIMEOUT);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeout.subscribe(() => {
      this.dialogService.openDialog(
        AutoLogoutComponent,
        ADMIN_CONST.TEXT.AUTO_LOGOUT_POPUP_TITLE,
        '',
        {
          confirmButtonLabel: ADMIN_CONST.TEXT.CONTINUE,
          RefuteButtonLabel: ADMIN_CONST.TEXT.LOG_OUT,
        },
        '',
      );
    });
  }
  public autoLogOutIdleWatcher() {
    this.idle.watch();
  }
}
