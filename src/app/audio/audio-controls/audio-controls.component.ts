import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AUDIO_CONSTANTS } from 'app/audio/audio.constant';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants } from '@core/constants/app.constant';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NotificationType, NotificationData } from '@shared/components/notification/notification-model';
import { NotificationService } from '@shared/components/notification/notification.service';
import { FACTORY_RESTORE_UUIDS, DIALOG_TEXTS } from './audio-controls.constant';
@Component({
  selector: 'app-audio-controls',
  templateUrl: './audio-controls.component.html',
  styleUrls: ['./audio-controls.component.scss'],
})
export class AudioControlsComponent implements OnInit, OnDestroy {
  constructor(
    private deviceManagerService: DeviceDataManagerService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationService: NotificationService,
    private zone: NgZone,
  ) {}
  microphoneMuteEnabled = true;
  bridgedBTCallEnabled = true;
  aecEnabled = true;
  audioUUIDs = AUDIO_CONSTANTS.UUID;
  unSubscribe: Subject<void> = new Subject();
  restoreDefault = new Subject();
  restoreObservable = this.restoreDefault.asObservable();

  ngOnInit() {
    this.subscribeControlState(this.audioUUIDs.ACOUSTIC_ECHO_CANCELLATION);
    this.subscribeControlState(this.audioUUIDs.MICROPHONE_MUTE_ACCESS);
    this.subscribeControlState(this.audioUUIDs.BRIDGED_BT_CALL);
  }

  subscribeControlState(uuid: string) {
    this.deviceManagerService
      .listenFromDevice(uuid)
      .pipe(
        takeUntil(this.unSubscribe),
        map((value: any) => value !== AppConstants.StateOff),
      )
      .subscribe((value: any) => {
        this.zone.run(() => {
          switch (uuid) {
            case this.audioUUIDs.ACOUSTIC_ECHO_CANCELLATION:
              this.aecEnabled = value;
              break;
            case this.audioUUIDs.MICROPHONE_MUTE_ACCESS:
              this.microphoneMuteEnabled = value;
              break;
            case this.audioUUIDs.BRIDGED_BT_CALL:
              this.bridgedBTCallEnabled = value;
              break;
          }
        });
      });
  }

  toggleMicrophoneState() {
    this.microphoneMuteEnabled = !this.microphoneMuteEnabled;
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.audioUUIDs.MICROPHONE_MUTE_ACCESS]: this.microphoneMuteEnabled
        ? AppConstants.StateOn
        : AppConstants.StateOff,
    });
  }

  toggleBridgedBTCall() {
    this.bridgedBTCallEnabled = !this.bridgedBTCallEnabled;
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.audioUUIDs.BRIDGED_BT_CALL]: this.bridgedBTCallEnabled ? AppConstants.StateOn : AppConstants.StateOff,
    });
  }

  displayToggleState(value: boolean) {
    return value ? AppConstants.ENABLED : AppConstants.DISABLED;
  }

  toggleAECState() {
    this.aecEnabled = !this.aecEnabled;
    this.deviceManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.audioUUIDs.ACOUSTIC_ECHO_CANCELLATION]: this.aecEnabled ? AppConstants.StateOn : AppConstants.StateOff,
    });
  }

  restoreDefaults() {
    const confirmationDialogModel = new ConfirmationDialogModel();
    confirmationDialogModel.title = DIALOG_TEXTS.RESTORE_DEFAULT_DIALOG_HEADER;
    confirmationDialogModel.content = DIALOG_TEXTS.RESTORE_DEFAULT_DIALOG_CONTENT;
    confirmationDialogModel.confirmButtonLabel = DIALOG_TEXTS.RESTORE_DEFAULT_CONFIRM_TEXT;

    this.confirmationDialogService.openConfirmationDialog(confirmationDialogModel).then((result: boolean) => {
      if (result) {
        this.deviceManagerService.sendToDevice(AppConstants.Action.Delete, FACTORY_RESTORE_UUIDS);
        const notificationData = new NotificationData();
        notificationData.message = DIALOG_TEXTS.DEFAULT_RESTORED;
        notificationData.messageType = NotificationType.success;
        this.restoreDefault.next(true);
        this.notificationService.showNotification(notificationData);
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
