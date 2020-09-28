import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressDialogComponent } from './progress-dialog.component';
import { ProgressDialogModel } from './progress-dialog.model';
import { SharedConstants } from '@shared/shared.constants';

@Injectable({
  providedIn: 'root',
})
export class ProgressDialogService {
  constructor(private dialog: MatDialog) {}

  openProgressDialog(progressDialogModel: ProgressDialogModel) {
    this.dialog.open(ProgressDialogComponent, {
      width: SharedConstants.PROGRESS_DIALOG_WIDTH,
      height: SharedConstants.PROGRESS_DIALOG_HEIGHT,
      data: progressDialogModel,
      disableClose: true,
      restoreFocus: false,
      position: {
        top: SharedConstants.DIALOG.CONFIRMATION_DIALOG.TOP,
        left: SharedConstants.DIALOG.CONFIRMATION_DIALOG.LEFT,
      },
    });
  }

  closeProgressDialog() {
    this.dialog.closeAll();
  }
}
