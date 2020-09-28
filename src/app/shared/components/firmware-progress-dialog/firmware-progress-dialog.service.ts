import { Injectable, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirmwareProgressDialogComponent } from './firmware-progress-dialog.component';
import { FirmwareProgressDialogModel } from './firmware-progress-dialog.model';
import { SharedConstants } from '@shared/shared.constants';
import { Subject } from 'rxjs';
import { ErrorService } from '@core/error/error.service';

@Injectable({
  providedIn: 'root',
})
export class FirmwareProgressDialogService {
  timerSubject = new Subject();
  public dialogRef: MatDialogRef<FirmwareProgressDialogComponent>;
  constructor(private dialog: MatDialog, private errorService: ErrorService, private ngZone: NgZone) {}

  openProgressDialog(firmwareProgressDialogModel: FirmwareProgressDialogModel) {
    this.dialogRef = this.dialog.open(FirmwareProgressDialogComponent, {
      width: SharedConstants.DIALOG_WIDTH,
      data: firmwareProgressDialogModel,
      disableClose: true,
      restoreFocus: false,
      closeOnNavigation: false,
      position: {
        top: SharedConstants.DIALOG.CONFIRMATION_DIALOG.TOP,
        left: SharedConstants.DIALOG.CONFIRMATION_DIALOG.LEFT,
      },
    });
  }

  closeProgressDialog() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }
}
