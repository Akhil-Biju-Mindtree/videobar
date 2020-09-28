import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrabPaneComponent } from './grab-pane.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConstants } from '@core/constants/app.constant';
import { CameraViewConstant } from 'app/camera-view/camera-view.constant';
import { Subject } from 'rxjs';

describe('GrabPaneComponent', () => {
  let component: GrabPaneComponent;
  let fixture: ComponentFixture<GrabPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrabPaneComponent],
      providers: [{ provide: DeviceDataManagerService, useValue: { sendToDevice: () => of('') } }],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrabPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on control pad Home preset click should send Preset to device', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const event: MouseEvent = new MouseEvent('click', { button: 0 });
    component.intervalUpdateObs = new Subject();
    component.onControlPadClick('ptHome', event);
    expect(spyOnSendToDevice).toBeCalledTimes(2);
  });

  it('on control pad pan right click should handle PT update', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const event: MouseEvent = new MouseEvent('click', { button: 0 });
    component.intervalUpdateObs = new Subject();
    component.onControlPadClick('panRight', event);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [CameraViewConstant.UUID.CAMERA_PAN_RIGHT_UUID]: '',
    });
  });

  it('on control pad pan left click should handle PT update', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const event: MouseEvent = new MouseEvent('click', { button: 0 });
    component.intervalUpdateObs = new Subject();
    component.onControlPadClick('panLeft', event);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [CameraViewConstant.UUID.CAMERA_PAN_LEFT_UUID]: '',
    });
  });

  it('on control pad tilt down click should handle PT update', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const event: MouseEvent = new MouseEvent('click', { button: 0 });
    component.intervalUpdateObs = new Subject();
    component.onControlPadClick('tiltDown', event);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [CameraViewConstant.UUID.CAMERA_TILT_DOWN_UUID]: '',
    });
  });

  it('on control pad tilt up click should handle PT update', () => {
    const spyOnSendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    const event: MouseEvent = new MouseEvent('click', { button: 0 });
    component.intervalUpdateObs = new Subject();
    component.onControlPadClick('tiltUp', event);
    expect(spyOnSendToDevice).toBeCalledWith(AppConstants.Action.Perform, {
      [CameraViewConstant.UUID.CAMERA_TILT_UP_UUID]: '',
    });
  });

  it('On control pad Home Preset release should change the preset color', () => {
    const spyOnCancelUpdate = spyOn(component.cancelUpdate, 'next');
    component.onContolPadClickReleased('ptHome');
    expect(spyOnCancelUpdate).toBeCalledTimes(1);
    expect(component).toHaveProperty('ptHome');
    expect(component.ptHome).toEqual('#d5d5d5');
  });

  it('On control pad release should not change the pad color if disabled', () => {
    const spyOnCancelUpdate = spyOn(component.cancelUpdate, 'next');
    component.isPanTiltDisabled = true;
    component.onContolPadClickReleased('tiltDown');
    expect(spyOnCancelUpdate).toBeCalledTimes(1);
    expect(component).toHaveProperty('tiltDown');
    expect(component['tiltDown']).toEqual('#f3f3f3');
  });

  it('On control pad release should change the pad color', () => {
    const spyOnCancelUpdate = spyOn(component.cancelUpdate, 'next');
    component.isPanTiltDisabled = false;
    component.onContolPadClickReleased('tiltDown');
    expect(spyOnCancelUpdate).toBeCalledTimes(1);
    expect(component).toHaveProperty('tiltDown');
    expect(component['tiltDown']).toEqual('#d5d5d5');
  });

  it('On mouse over Home preset control pad color should change to medium grey', () => {
    component.onOverContolPad('ptHome');
    expect(component).toHaveProperty('ptHome');
    expect(component.ptHome).toEqual('#d5d5d5');
  });

  it('On mouse over the conrol pad color should not change color is disabled', () => {
    component.isPanTiltDisabled = true;
    component.onOverContolPad('tiltDown');
    expect(component).toHaveProperty('tiltDown');
    expect(component['tiltDown']).toEqual('#f3f3f3');
  });

  it('On mouse over the conrol pad color should change to medium grey', () => {
    component.isPanTiltDisabled = false;
    component.onOverContolPad('tiltDown');
    expect(component).toHaveProperty('tiltDown');
    expect(component['tiltDown']).toEqual('#d5d5d5');
  });

  it('On mouse out Home preset control pad color should change to light grey', () => {
    const spyOnCancelUpdate = spyOn(component.cancelUpdate, 'next');
    component.onOutControlPad('ptHome');
    expect(spyOnCancelUpdate).toBeCalledTimes(1);
    expect(component).toHaveProperty('ptHome');
    expect(component.ptHome).toEqual('#f3f3f3');
  });

  it('On mouse out the control pad color should not change color if disabled', () => {
    const spyOnCancelUpdate = spyOn(component.cancelUpdate, 'next');
    component.isPanTiltDisabled = true;
    component.onOutControlPad('tiltDown');
    expect(spyOnCancelUpdate).toBeCalledTimes(1);
    expect(component).toHaveProperty('tiltDown');
    expect(component['tiltDown']).toEqual('#f3f3f3');
  });

  it('On mouse out the control pad color should change to light grey', () => {
    const spyOnCancelUpdate = spyOn(component.cancelUpdate, 'next');
    component.isPanTiltDisabled = false;
    component.onOutControlPad('tiltDown');
    expect(spyOnCancelUpdate).toBeCalledTimes(1);
    expect(component).toHaveProperty('tiltDown');
    expect(component['tiltDown']).toEqual('#f3f3f3');
  });

  it('should change color on changes based on PT enabled', () => {
    component.isPanTiltDisabled = false;
    component.ngOnChanges();
    expect(component.tiltDown).toEqual('#f3f3f3');
    expect(component.tiltUp).toEqual('#f3f3f3');
    expect(component.panLeft).toEqual('#f3f3f3');
    expect(component.panRight).toEqual('#f3f3f3');
    expect(component.panArrow).toEqual('#242424');
  });

  it('should change color on changes based on PT disabled', () => {
    component.isPanTiltDisabled = true;
    component.ngOnChanges();
    expect(component.tiltDown).toEqual('#f8f8f8');
    expect(component.tiltUp).toEqual('#f8f8f8');
    expect(component.panLeft).toEqual('#f8f8f8');
    expect(component.panRight).toEqual('#f8f8f8');
    expect(component.panArrow).toEqual('#BEBEBE');
  });
});
