import { Component, OnInit, Inject, NgZone, HostListener } from '@angular/core';
import { ConfirmationDialogModel } from './confirmation-dialog.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedConstants } from '@shared/shared.constants';
import { truncate } from 'fs';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  ESCAPE_KEY = SharedConstants.KEYBOARD_KEYS.ESCAPE_KEY;
  ESCAPE_IE_KEY = SharedConstants.KEYBOARD_KEYS.ESCAPE_IE_KEY;
  ENTER_KEY = SharedConstants.KEYBOARD_KEYS.ENTER_KEY;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === this.ESCAPE_KEY || event.key === this.ESCAPE_IE_KEY) {
      this.closeDialog(false);
    }
    if (event.key === this.ENTER_KEY && document.activeElement.tagName !== 'BUTTON') {
      this.closeDialog(true);
    }
  }
  constructor(
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogModel,
  ) {}

  ngOnInit() {}

  dialogTypeError() {
    if (this.data.dialogType === SharedConstants.ERROR_DIALOG) {
      return true;
    }
    return false;
  }

  closeDialog(status) {
    this.ngZone.run(() => {
      this.dialogRef.close(status);
    });
  }
}
