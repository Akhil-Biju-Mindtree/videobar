import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { CameraControlsComponent } from './camera-controls.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { of } from 'rxjs/internal/observable/of';
import { CameraViewConstant } from '../camera-view.constant';
import { ContextMenuData } from '@shared/components/context-menu/context.menu.model';
import { AppConstants } from '@core/constants/app.constant';
import { By } from '@angular/platform-browser';

@Component({
  template: `<button (mouseup)="data($event)"></button>`,
})
class TestComponent {
  event;
  data(event) {
    this.event = event;
  }
}

class DeviceDataManagerServiceMock {
  listenFromDevice(uuid) {
    let returnValue;
    if (uuid === CameraViewConstant.UUID.SPEAKER_MUTE) {

      returnValue = of('0');
    } else {
      returnValue = of('');
    }
    return returnValue;
  }

  sendToDevice(action, object) {
    return {};
  }
}
describe('CameraControlsComponent', () => {
  let component: CameraControlsComponent;
  let fixture: ComponentFixture<CameraControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CameraControlsComponent],
      providers: [
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: NotificationService, useValue: { showNotification: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On context menu open selected activate preset should send action to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const event: ContextMenuData = {
      params: { presetId: '3' },
      selectedItem: { text: 'Go to Preset', value: 0 },
    };
    component.contextMenuSelect(event);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [component.uuid.ACTIVE_PRESET_UUID]: event.params.presetId,
    });
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [component.uuid.APPLY_ACTIVE_PRESET_UUID]: '',
    });
  });

  it('On context menu open selected save preset 1 should send action to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice').and.returnValue(of(''));
    const spyOnNotificationService = spyOn(TestBed.get(NotificationService), 'showNotification');
    const event: ContextMenuData = {
      params: { presetId: '2' },
      selectedItem: { text: 'Save to Preset', value: 1 },
    };
    component.contextMenuSelect(event);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [component.uuid.SAVE_PRESET_FIRST]: '',
    });
    expect(spyOnNotificationService).toBeCalled();
  });

  it('On context menu open selected save preset 2 should send action to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice').and.returnValue(of(''));
    const spyOnNotificationService = spyOn(TestBed.get(NotificationService), 'showNotification');
    const event: ContextMenuData = {
      params: { presetId: '3' },
      selectedItem: { text: 'Save to Preset', value: 1 },
    };
    component.contextMenuSelect(event);
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [component.uuid.SAVE_PRESET_SECOND]: '',
    });
    expect(spyOnNotificationService).toBeCalled();
  });

  it('On zoom change should disable PT if zoom value is 1', () => {
    component.handleZoomChange('1');
    expect(component.isPanTiltDisabled).toBeTruthy();
  });

  it('On zoom change should enabled PT if zoom value is > 1', () => {
    component.handleZoomChange('4');
    expect(component.isPanTiltDisabled).toBeFalsy();
  });

  it('On handle volume change should not mute if volume is > 0', () => {
    component.volumeLoadedFirstTime = false;
    component.handleVolumeChange('3');
    expect(component.volumeMute).toBeFalsy();
  });

  it('On handle volume change should mute if volume is 0', () => {
    component.volumeLoadedFirstTime = false;
    component.handleVolumeChange('0');
    expect(component.volumeMute).toBeTruthy();
  });

  it('On handle volume change should not change if volume is already loaded', () => {
    component.volumeLoadedFirstTime = true;
    component.handleVolumeChange('3');
    expect(component.volumeLoadedFirstTime).toBeFalsy();
  });

  it('On handle volume change should not change if volume is undefined', () => {
    component.volumeLoadedFirstTime = false;
    component.volumeMute = false;
    component.handleVolumeChange(undefined);
    expect(component.volumeMute).toBeFalsy();
  });

  it('On volume mute change to 1 shoud update the device and UI', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice').and.returnValue(of(''));
    component.volumeAction('1');
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [CameraViewConstant.UUID.SPEAKER_MUTE]: '1',
    });
    expect(component.volumeMute).toBeTruthy();
  });

  it('On volume mute change to 0 shoud update the device and UI', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice').and.returnValue(of(''));
    component.volumeAction('0');
    expect(spySendToDevice).toBeCalledWith(AppConstants.Action.Update, {
      [CameraViewConstant.UUID.SPEAKER_MUTE]: '0',
    });
    expect(component.volumeMute).toBeFalsy();
  });
});
