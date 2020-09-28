import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { CameraSettingsComponent } from './camera-settings.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { AppConstants } from '@core/constants/app.constant';
import {
  NotificationData,
  NotificationType,
  NotificationVposition,
  NotificationHposition,
} from '@shared/components/notification/notification-model';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';
import { VideoConstant } from '../video.constant';
import { FormControl } from '@angular/forms';

class DeviceDataManagerServiceMock {
  listenFromDevice(key) {
    return of('');
  }

  sendToDevice(action, object) {
    let returnValue;
    switch (Object.keys(object)[0]) {
      case '46f9bcab-efff-499f-a78f-fedee46c5177':
        returnValue = of('');
        break;
      case '7da31ca1-8296-43ba-8b19-b6bb0cc37f69':
        returnValue = of('');
        break;
      case '931400ef-58eb-4480-87cf-6b3b1a05c239':
        returnValue = of('');
        break;
      default:
        returnValue = '';
    }
    return returnValue;
  }
}

describe('CameraSettingsComponent', () => {
  let component: CameraSettingsComponent;
  let fixture: ComponentFixture<CameraSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CameraSettingsComponent],
      providers: [
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: NotificationService, useValue: { showNotification: () => {} } },
        { provide: ConfirmationDialogService, useValue: { openConfirmationDialog: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle slider on Zoom out', fakeAsync(() => {
    component.handleSliderUpdate('1', 2);
    tick(100);
    expect(component.isZoomedOut).toBeTruthy();
  }));

  it('should handle slider on Zoom value more than 1', fakeAsync(() => {
    component.handleSliderUpdate('5', 2);
    tick(100);
    expect(component.isZoomedOut).toBeFalsy();
  }));

  it('should toggle select panel', () => {
    component.showSelectPanel = true;
    component.toggleSelectPanel();
    expect(component.showSelectPanel).toBeFalsy();
  });

  it('shold disable conntrol of PT based on Zoom', () => {
    component.isZoomedOut = true;
    const returnValue = component.isControlDisabled(1);
    expect(returnValue).toBeTruthy();
  });

  it('should call savePreset on save any preset other than Home', () => {
    const preset = component.presets[1];
    const spyOnSavePreset = spyOn(component, 'savePreset');
    component.onSavePreset(preset);
    expect(spyOnSavePreset).toBeCalledWith(preset);
  });

  it('should call dialog on save Home preset', () => {
    const presetHome = component.presets[2];
    const spyOnDialog = spyOn(component, 'showDialog').and.returnValue({
      then: (res) => {
        return of(true);
      },
    });
    component.onSavePreset(presetHome);
    expect(spyOnDialog).toBeCalledTimes(1);
  });

  it('should send perform on particular saved preset', () => {
    const spyOnShowSuccesMesage = spyOn(component, 'showSuccessWithAutoClose');
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice').and.returnValue(of(''));
    component.savePreset(component.presets[0]);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [component.presets[0].savePresetuuid]: '',
    });
    expect(spyOnShowSuccesMesage).toBeCalledWith(component.presets[0].successMessage);
  });

  it('should call notification service', () => {
    const spyOnNotificationService = spyOn(TestBed.get(NotificationService), 'showNotification');
    component.showSuccessWithAutoClose(component.presets[0].successMessage);
    const expectedResult = new NotificationData();
    expectedResult.message = component.presets[0].successMessage;
    expectedResult.messageType = NotificationType.success;
    expectedResult.showButton = false;
    expectedResult.verticalPosition = NotificationVposition.bottom;
    expectedResult.horizontalPosition = NotificationHposition.left;
    expect(spyOnNotificationService).toBeCalledWith(expectedResult);
  });

  it('should show dialog with particular content and title', () => {
    const spyOnConfermationDialog = spyOn(TestBed.get(ConfirmationDialogService), 'openConfirmationDialog');
    const expectedResult = new ConfirmationDialogModel();
    expectedResult.title = 'title';
    expectedResult.content = 'content';
    expectedResult.confirmButtonLabel = 'confirm';
    component.showDialog('title', 'content', 'confirm');
    expect(spyOnConfermationDialog).toBeCalledWith(expectedResult);
  });

  it('should not show dialog if form is not dirty', () => {
    const result = component.canDeactivate();
    expect(result).toBeTruthy();
  });

  it('should show dialog if form is dirty', () => {
    for (const preset of component.presets) {
      component.presetsFormGroup.addControl(preset.uuid, new FormControl(''));
    }
    component.presetsFormGroup.get(component.presets[0].uuid).markAsDirty();
    const expectedResult = component.showDialog(
      VideoConstant.DIALOG_TEXTS.UNSAVED_CHANGES_DIALOG_HEADER,
      VideoConstant.DIALOG_TEXTS.UNSAVED_CHANGES_DIALOG_CONTENT,
      VideoConstant.DIALOG_TEXTS.UNSAVED_CHANGES_CONFIRM_TEXT,
    );
    const result = component.canDeactivate();
    expect(result).toEqual(expectedResult);
  });

  it('should display auto close success notification for preset 1', () => {
    const spyOnShowSuccesMesage = spyOn(component, 'showSuccessWithAutoClose');
    component.showNotification('2');
    expect(spyOnShowSuccesMesage).toBeCalledWith(VideoConstant.TEXT.PRESET1SAVED);
  });

  it('should display auto close success notification for preset 2', () => {
    const spyOnShowSuccesMesage = spyOn(component, 'showSuccessWithAutoClose');
    component.showNotification('3');
    expect(spyOnShowSuccesMesage).toBeCalledWith(VideoConstant.TEXT.PRESET2SAVED);
  });

  it('should display auto close success notification for home preset', () => {
    const spyOnShowSuccesMesage = spyOn(component, 'showSuccessWithAutoClose');
    component.showNotification('1');
    expect(spyOnShowSuccesMesage).toBeCalledWith(VideoConstant.TEXT.HOMEPRESETSAVED);
  });

  it('should disable dropdown on invalid ptz values', fakeAsync(() => {
    component.presetControls.forEach((preserControl) => {
      component.ptzFormGroup.addControl(preserControl.uuid, new FormControl(''));
    });
    component.subscribeFormState();
    tick(200);
    expect(component.isDropDownDisabled).toBeFalsy();
  }));
});
