import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogModel } from './confirmation-dialog.model';
import { SharedConstants } from '@shared/shared.constants';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  public dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  constructor(private dialog: MatDialog) {}

  openConfirmationDialog(confirmationDialogModel: ConfirmationDialogModel): Promise<boolean> {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: SharedConstants.DIALOG_WIDTH,
      data: confirmationDialogModel,
      disableClose: true,
      restoreFocus: false,
      panelClass: 'custom-overlay-panel',
      position: {
        top: SharedConstants.DIALOG.CONFIRMATION_DIALOG.TOP,
        left: SharedConstants.DIALOG.CONFIRMATION_DIALOG.LEFT,
      },
    });

    return this.dialogRef.afterClosed().toPromise();
  }

  closeConfirmationDialog() {
    this.dialogRef.close();
  }
}
