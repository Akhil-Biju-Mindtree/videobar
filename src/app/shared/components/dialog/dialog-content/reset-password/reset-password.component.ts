import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PASSWORD_CONSTANTS } from './reset-password.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AppConstants } from '@core/constants/app.constant';
import { UtilitiesService } from '@core/services/utilities.service';
import { ADMIN_CONST } from 'app/admin/admin.constant';
import { confirmPasswordValidatior, validateCustomPattern } from './reset-password.validator';
import { INPUT_ERRORS } from '@core/error/error.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog.component';
import { NotificationData, NotificationType } from '@shared/components/notification/notification-model';
import { DIALOG_TEXTS } from 'app/configuration/system/system.constant';
import { NotificationService } from '@shared/components/notification/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  uuid = ADMIN_CONST.UUID.SYSTEM_PASSWORD;
  passwordConstant = PASSWORD_CONSTANTS.TEXT;
  confirmPassword: string;
  formGroup = new FormGroup({});
  isRequired = true;
  regEx = ADMIN_CONST.PASSWORD_REGEX;
  maxLength = ADMIN_CONST.PASSWORD_MAX_LENGTH;
  passwordMatchMsg = INPUT_ERRORS.PASSWORD_MATCH_ERROR;
  passwordFormatMsg = INPUT_ERRORS.PASSWORD_FORMAT_ERROR;
  regExPassIcon = PASSWORD_CONSTANTS.ICONS.REGEX_PASS_ICON;
  regExFailIcon = PASSWORD_CONSTANTS.ICONS.REGEX_FAIL_ICON;
  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.formGroup
      .get(PASSWORD_CONSTANTS.TEXT.PASSWORD)
      .setValidators([
        Validators.required,
        validateCustomPattern(PASSWORD_CONSTANTS.NUMBER_REGEX, PASSWORD_CONSTANTS.TEXT.NUMBER),
        validateCustomPattern(PASSWORD_CONSTANTS.ALPHABET_REGEX, PASSWORD_CONSTANTS.TEXT.ALPHABET),
        validateCustomPattern(PASSWORD_CONSTANTS.SPECIALCHARS_REGEX, PASSWORD_CONSTANTS.TEXT.SPECIALCHAR),
        Validators.minLength(PASSWORD_CONSTANTS.PASSWORD_MIN_LENGTH),
      ]);
    this.formGroup.setValidators(confirmPasswordValidatior);
  }

  onSubmitDialog() {
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.uuid]: this.utilitiesService.generateMd5Hash(this.formGroup.get(PASSWORD_CONSTANTS.TEXT.PASSWORD).value),
    });
    this.dialogRef.close();
    const notificationData = new NotificationData();
    notificationData.message = DIALOG_TEXTS.CHANGED_PASSWORD_MESSAGE;
    notificationData.messageType = NotificationType.success;
    this.notificationService.showNotification(notificationData);
  }

  getIconOnValidation(validationType) {
    const passwordControl = this.formGroup.get(PASSWORD_CONSTANTS.TEXT.PASSWORD);
    return passwordControl && passwordControl.dirty && !passwordControl.hasError(validationType);
  }

  isInvalid() {
    const confirmPasswordControl = this.formGroup.get(PASSWORD_CONSTANTS.TEXT.CONFIRM_PASSWORD);
    return confirmPasswordControl &&
      confirmPasswordControl.touched &&
      confirmPasswordControl.dirty &&
      (confirmPasswordControl.invalid || this.formGroup.hasError(PASSWORD_CONSTANTS.TEXT.CONFIRM_PASSWORD))
      ? true
      : null;
  }
}
