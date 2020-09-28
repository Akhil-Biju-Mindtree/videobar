import { Component, OnInit, Inject, NgZone, OnDestroy } from '@angular/core';
import { ProgressDialogModel } from './progress-dialog.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss'],
})
export class ProgressDialogComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  profileImportStatus: number;

  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgressDialogModel,
    private deviceManagerService: DeviceDataManagerService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.deviceManagerService
      .listenFromDevice(this.data.uuid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((profileImportStatus: string) => {
        this.ngZone.run(() => {
          this.profileImportStatus = parseInt(profileImportStatus, 10);
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
