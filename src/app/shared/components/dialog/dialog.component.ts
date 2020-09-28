import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstants } from '@core/constants/app.constant';
import { map } from 'rxjs/operators';
import { SharedConstants } from '@shared/shared.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) viewContainerRef: ViewContainerRef;
  componentRef: ComponentRef<any>;
  isFormInValid = false;
  ESCAPE_KEY = SharedConstants.KEYBOARD_KEYS.ESCAPE_KEY;
  ESCAPE_IE_KEY = SharedConstants.KEYBOARD_KEYS.ESCAPE_IE_KEY;
  ENTER_KEY = SharedConstants.KEYBOARD_KEYS.ENTER_KEY;
  statusChangesSub: Subscription;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === this.ESCAPE_KEY || event.key === this.ESCAPE_IE_KEY) {
      this.closeDialog(false);
    }
    if (event.key === this.ENTER_KEY) {
      this.handleEnterButtonClick();
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {}

  handleEnterButtonClick() {
    if (document.activeElement.tagName !== 'BUTTON' && !this.isFormInValid) {
      this.onConfirmation();
    }
  }

  closeDialog(status) {
    if (this.componentRef.instance.onCloseDialog) {
      return this.componentRef.instance.onCloseDialog();
    }
    this.dialogRef.close(status);
  }

  /**
   * dialog-content should have variable as Form Group name: formGroup
   */
  ngAfterViewInit() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.data.componentToLoad);
    this.componentRef = this.viewContainerRef.createComponent(factory);
    this.componentRef.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.isFormInValid = this.componentRef.instance.formGroup.status !== AppConstants.VALID;
    });
    this.statusChangesSub = this.componentRef.instance.formGroup.statusChanges
      .pipe(map((formValid: string) => formValid !== AppConstants.VALID))
      .subscribe((isFormInValid: boolean) => {
        this.isFormInValid = isFormInValid;
      });
  }

  /**
   * dialog-content should have the method name: onSubmitDialog() when confirmation button is clicked
   */
  onConfirmation() {
    this.componentRef.instance.onSubmitDialog();
  }

  ngOnDestroy() {
    this.componentRef.destroy();
    this.statusChangesSub.unsubscribe();
  }
}
