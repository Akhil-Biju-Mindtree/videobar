import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SharedConstants } from '@shared/shared.constants';
import { DialogComponent } from './dialog.component';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public dialogRef;
  leftPosition = SharedConstants.DIALOG.CONFIRMATION_DIALOG.LEFT;

  get isFullScreen() {
    return this.applicationDataManagerService.listenForAppData(AppConstants.AUDIO_BEAMS_EXPANDED);
  }
  constructor(private dialog: MatDialog, private applicationDataManagerService: ApplicationDataManagerService) {
    this.getFullScreenStatus();
  }

  getFullScreenStatus() {
    this.isFullScreen.subscribe((fullScreen) => {
      if (fullScreen) {
        this.leftPosition = SharedConstants.DIALOG.CONFIRMATION_DIALOG.FUllSCREEN_LEFT;
      } else {
        this.leftPosition = SharedConstants.DIALOG.CONFIRMATION_DIALOG.LEFT;
      }
    });
  }

  openDialog(componentToLoad, displayContentText, icon, buttonLabel, value, noBtnFocus?): Promise<boolean> {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: SharedConstants.DIALOG_WIDTH,
      data: { componentToLoad, displayContentText, icon, buttonLabel, value, noBtnFocus },
      disableClose: true,
      position: {
        top: SharedConstants.DIALOG.CONFIRMATION_DIALOG.TOP,
        left: this.leftPosition,
      },
    });

    return this.dialogRef.afterClosed().toPromise();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
