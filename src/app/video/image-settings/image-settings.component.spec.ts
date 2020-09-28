import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ImageSettingsComponent } from './image-settings.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { of } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConstants } from '@core/constants/app.constant';
import { VideoConstant } from '../video.constant';
import { ConfirmationDialogModel } from '@shared/components/confirmation-dialog/confirmation-dialog.model';

describe('ImageSettingsComponent', () => {
  let component: ImageSettingsComponent;
  let fixture: ComponentFixture<ImageSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageSettingsComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of(''), sendToDevice: () => of('') } },
        { provide: ConfirmationDialogService, useValue: { openConfirmationDialog: () => {} } },
        { provide: NotificationService, useValue: { showNotification: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on button clicked on low light correction', () => {
    component.onButtonClicked(true);
    expect(component.islowLightCorrectionOn).toBeTruthy();
  });

  it('on white balance auto checked send to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onWhiteBalanceAutoChecked(false);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [component.whiteBalance[0].uuid]: AppConstants.StateOff,
    });
  });

  it('on white balance auto unchecked send to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onWhiteBalanceAutoChecked(true);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [component.whiteBalance[0].uuid]: AppConstants.StateOn,
    });
  });

  it('on back light control data received send to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    component.onDropdownReceive({ value: 'low' });
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [component.backLightControl.uuid]: 'low',
    });
  });

  it('on destroy should end the subscribtion', () => {
    spyOn(component.unSubscribe, 'next');
    spyOn(component.unSubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unSubscribe.next).toHaveBeenCalledTimes(1);
    expect(component.unSubscribe.complete).toHaveBeenCalledTimes(1);
  });

  it('on restore default open confirmation dialog', () => {
    const spyOnConfirmationDialog = spyOn(
      TestBed.get(ConfirmationDialogService),
      'openConfirmationDialog',
    ).and.returnValue(Promise.resolve(false));
    const expectedResult = new ConfirmationDialogModel();
    expectedResult.title = VideoConstant.DIALOG_TEXTS.AUTOFRAME_DIALOG_HEADER;
    expectedResult.content = VideoConstant.DIALOG_TEXTS.IMAGE_DIALOG_CONTENT;
    expectedResult.confirmButtonLabel = VideoConstant.DIALOG_TEXTS.AUTOFRAME_CONFIRM_TEXT;
    component.restoreDefaults();
    expect(spyOnConfirmationDialog).toBeCalledWith(expectedResult);
  });

  it('on restore default confirmation send delete action to device', fakeAsync(() => {
    const spyOnConfirmationDialog = spyOn(
      TestBed.get(ConfirmationDialogService),
      'openConfirmationDialog',
    ).and.returnValue(Promise.resolve(true));
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const expectedResult = new ConfirmationDialogModel();
    expectedResult.title = VideoConstant.DIALOG_TEXTS.AUTOFRAME_DIALOG_HEADER;
    expectedResult.content = VideoConstant.DIALOG_TEXTS.IMAGE_DIALOG_CONTENT;
    expectedResult.confirmButtonLabel = VideoConstant.DIALOG_TEXTS.AUTOFRAME_CONFIRM_TEXT;
    component.restoreDefaults();
    expect(spyOnConfirmationDialog).toBeCalledWith(expectedResult);
    tick(100);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Delete, component.factoryRestoreUUIDS);
  }));
});
