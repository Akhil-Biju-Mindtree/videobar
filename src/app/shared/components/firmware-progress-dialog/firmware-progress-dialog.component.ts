import { Component, OnInit, Inject, OnDestroy, NgZone } from '@angular/core';
import { FirmwareProgressDialogModel } from './firmware-progress-dialog.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirmwareConstants } from 'app/configuration/firmware/firmware.constant';

@Component({
  selector: 'app-firmware-progress-dialog',
  templateUrl: './firmware-progress-dialog.component.html',
  styleUrls: ['./firmware-progress-dialog.component.scss'],
})
export class FirmwareProgressDialogComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  currentProgress = 0;
  totalProgress = 0;
  totalStartProgress = 0;
  currentProgressKey = 'FirmwareCurrentProgress';

  constructor(
    private ngZone: NgZone,
    private applicationDataManagerService: ApplicationDataManagerService,
    public dialogRef: MatDialogRef<FirmwareProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FirmwareProgressDialogModel,
  ) {}

  ngOnInit() {
    this.adjustTotalProgress();
    this.listenforCurrentProgress();
  }

  listenforCurrentProgress() {
    this.applicationDataManagerService
      .listenForAppData(this.currentProgressKey)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((currentProgress: number) => {
        this.ngZone.run(() => {
          this.currentProgress = currentProgress;
          if (
            this.data.currentOperationText === FirmwareConstants.PROGRESS_TEXT.COPY &&
            this.data.previousOperation === 'none'
          ) {
            this.totalProgress = this.totalStartProgress + Math.floor(currentProgress / 2);
          } else if (this.data.currentOperationText !== FirmwareConstants.PROGRESS_TEXT.WAITING) {
            this.totalProgress = this.totalStartProgress + Math.floor(currentProgress / 4);
          }
        });
      });
  }

  adjustTotalProgress() {
    switch (this.data.currentOperationText) {
      case FirmwareConstants.PROGRESS_TEXT.DOWNLOAD:
        this.totalStartProgress = 0;
        break;
      case FirmwareConstants.PROGRESS_TEXT.COPY:
        this.totalStartProgress = this.data.previousOperation === FirmwareConstants.PROGRESS_TEXT.DOWNLOAD ? 25 : 0;
        break;
      case FirmwareConstants.PROGRESS_TEXT.FILESYSTEM:
        this.totalStartProgress = 50;
        break;
      case FirmwareConstants.PROGRESS_TEXT.CAMERA:
        this.totalStartProgress = 75;
        break;
    }
  }

  updateStep(currentOperationText) {
    this.ngZone.run(() => {
      this.data.previousOperation = this.data.currentOperationText;
      this.data.currentOperationText = currentOperationText;
      this.adjustTotalProgress();
    });
  }

  ngOnDestroy(): void {
    this.applicationDataManagerService.saveToAppData({ FirmwareCurrentProgress: 0 });
    this.totalProgress = 0;
    this.totalStartProgress = 0;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
