import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { AngularP5Service } from './angular-p5.service';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs/internal/observable/of';
import { Router } from '@angular/router';
import { staticBeamUUIDs } from '../audio.constant';
import { Beam } from './p5-models/beam';
import { Zone } from './p5-models/zone';

class DeviceDataManagerServiceMock {
  listenFromDevice(key) {
    let returnValue;
    switch (key) {
      case '0d485156-2fd5-4d20-bf79-583de2b880a1':
        returnValue = 'dynamic';
        break;
      case '6afd6f2a-73c5-4cad-8264-df40abc47045':
        returnValue = '1 0 0 -1 1';
        break;
      case '8fc4027d-96f1-4a9d-b45c-68085a98cefb':
        returnValue = '1 5 60 -24 0';
        break;
      default:
        returnValue = '';
    }
    return of(returnValue);
  }

  sendToDevice(action, object) {
    return '';
  }
}

describe('AngularP5Service Dyanamic Beams', () => {
  let angularP5Service: AngularP5Service;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AngularP5Service,
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: Router, useValue: {} },
      ],
    }),
  );

  beforeEach(() => {
    angularP5Service = TestBed.get(AngularP5Service);
  });

  it('on subcribe to beam type should navigate and save beam type on changes', () => {
    angularP5Service.subscribeToBeamTypeData();
    expect(angularP5Service.getSelectedBeamType()).toEqual('dynamic');
  });

  it('on amm data received update beams accordingly based on beam type', () => {
    angularP5Service.subscribeToAmmData();
    expect(angularP5Service.dynamicBeams[0].amm).toEqual(1);
    expect(angularP5Service.dynamicBeams[1].amm).toEqual(0);
    expect(angularP5Service.dynamicBeams[2].amm).toEqual(0);
    expect(angularP5Service.dynamicBeams[3].amm).toEqual(-1);
    expect(angularP5Service.runningBeam.amm).toEqual(1);
  });

  it('on subcribe to Dynamic Beam type should save the running and dynamic beam changes', () => {
    angularP5Service.subscribeToDynamicBeamData();
    expect(angularP5Service.dynamicBeams[0].angle).toBeCloseTo(-1.07142, 3);
    expect(angularP5Service.dynamicBeams[1].angle).toBeCloseTo(-5.35714, 3);
    expect(angularP5Service.dynamicBeams[2].angle).toBeCloseTo(180, 1);
    expect(angularP5Service.dynamicBeams[3].angle).toBeCloseTo(25.71428, 3);
    expect(angularP5Service.runningBeam.angle).toBeCloseTo(-0, 3);
  });

  it('on unsubscribe dyanmic beam should stop listening for dynamic & running beam', () => {
    const spyOnService = spyOn(angularP5Service.dynamicBeamDataSubscription, 'unsubscribe');
    angularP5Service.unSubscribeToDynamicBeamData();
    expect(spyOnService).toBeCalledTimes(1);
  });

  it('should set & get dynamic beam', () => {
    const beam = [new Beam(1), new Beam(10), new Beam(-10), new Beam(45)];
    angularP5Service.setDynamicBeams(beam);
    expect(angularP5Service.getDynamicBeams()).toEqual(beam);
  });
});

describe('AngularP5Service Static Beams', () => {
  let service: AngularP5Service;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AngularP5Service,
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: Router, useValue: {} },
      ],
    }),
  );

  beforeEach(() => {
    service = TestBed.get(AngularP5Service);
    service.staticBeams[0].angle = 2;
    service.staticBeams[1].angle = -5;
    service.staticBeams[2].angle = 180;
    service.staticBeams[3].angle = 34;
  });

  it('on updateBeamType should send beam type to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    service.updateBeamTypeData('fixed');
    expect(spySendToDevice).toBeCalledWith('update', { '0d485156-2fd5-4d20-bf79-583de2b880a1': 'fixed' });
  });

  it('on unsubscribe amm data should stop listening for amm', () => {
    const spyOnService = spyOn(service.ammStateSubscription, 'unsubscribe');
    service.unsubscribeAmmData();
    expect(spyOnService).toBeCalledTimes(1);
  });

  it('on unsubscribe beam type should stop listening for beam type', () => {
    const spyOnService = spyOn(service.beamTypeSubscription, 'unsubscribe');
    service.unsubscribeBeamTypeData();
    expect(spyOnService).toBeCalledTimes(1);
  });

  it('on beam angle change should send new angles to device', () => {
    service.staticBeams[2].angle = 23;
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    service.updateStaticBeamAngle(2);
    const uuid = service.staticBeams[2].beamUUID;
    expect(spySendToDevice).toBeCalledWith('update', { [uuid]: '-21' });
  });

  it('on delete beam should send disable to device', fakeAsync(() => {
    service.staticBeams[2].angle = 23;
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    service.deleteBeam(2);
    const uuid = service.staticBeams[2].beamUUID;
    tick(10);
    expect(spySendToDevice).toBeCalledWith('update', { [uuid]: 'disabled' });
    expect(service.staticBeams[2].angle).toEqual(180);
  }));

  it('on isStatic beam delete method is called should return false on empty available uuid', () => {
    service.availableUUIDs = [];
    const uuid = service.staticBeams[2].beamUUID;
    const expectedResult = service.isStaticBeamDeleted(uuid);
    expect(expectedResult).toBeFalsy();
  });

  it('on isStatic beam delete method is called should return true on available uuid has input uuid', () => {
    service.availableUUIDs = [service.staticBeams[1].beamUUID, service.staticBeams[2].beamUUID];
    const uuid = service.staticBeams[2].beamUUID;
    const expectedResult = service.isStaticBeamDeleted(uuid);
    expect(expectedResult).toBeTruthy();
  });

  it('on isStatic beam delete method is called should return false on empty available uuid', () => {
    service.availableUUIDs = [service.staticBeams[0].beamUUID, service.staticBeams[1].beamUUID];
    const uuid = service.staticBeams[2].beamUUID;
    const expectedResult = service.isStaticBeamDeleted(uuid);
    expect(expectedResult).toBeFalsy();
  });

  it('on static beam data retrive should send retrive action to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    service.retriveStaticBeamData();
    expect(spySendToDevice).toBeCalledWith('retrieve', staticBeamUUIDs.allUUIDs);
  });

  it('on static beam add should find available angle & send the angle to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    service.deletedBeamIndises = [2];
    service.addBeam();
    const uuid = service.staticBeams[2].beamUUID;
    expect(spySendToDevice).toBeCalledWith('update', { [uuid]: '-8' });
  });

  it('check beam boundary and unoverlap the beam', () => {
    const spyInitBeamMovementProperties = spyOn(service, 'initBeamMovementProperties');
    service.staticBeams[0].angle = 10;
    service.staticBeams[0].minimumMovementAngle = 10.235654;

    service.staticBeams[1].angle = -30;
    service.staticBeams[1].maximumMovementAngle = -30.436543;

    service.staticBeams[2].angle = -5;
    service.staticBeams[2].maximumMovementAngle = -6;
    service.staticBeams[2].minimumMovementAngle = -6;
    service.checkStaticBeamsInBoundary();
    expect(service.staticBeams[0].angle).toBeCloseTo(service.staticBeams[0].minimumMovementAngle, 3);
    expect(service.staticBeams[1].angle).toBeCloseTo(service.staticBeams[1].maximumMovementAngle, 3);
    expect(service.staticBeams[2].angle).toBeCloseTo(service.staticBeams[2].minimumMovementAngle, 3);
    expect(spyInitBeamMovementProperties).toBeCalledTimes(3);
  });

  it('check beams overlaped or invalid values from other application', fakeAsync(() => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    service.staticBeams[0].angle = 30;
    service.staticBeams[1].angle = 40;
    service.staticBeams[2].angle = 20;
    service.staticBeams[3].angle = 17;
    service.checkBeamOverlapped();
    tick(10);
    expect(spySendToDevice).toBeCalledTimes(1);
  }));

  it('should set & get running beam', () => {
    const beam = new Beam(1);
    service.setRunningBeams(beam);
    expect(service.getRunningBeams()).toEqual(beam);
  });

  it('should set & get static beam', () => {
    const beam = [new Beam(1), new Beam(10), new Beam(-10), new Beam(45)];
    service.setStaticBeams(beam);
    expect(service.getStaticBeams()).toEqual(beam);
  });

  it('should set & get curently selected beam', () => {
    const beam = new Beam(4);
    service.setCurrentlySelectedBeam(beam);
    expect(service.getCurrentlySelectedBeam()).toEqual(beam);
  });

  it('should set & get curently selected beam index', () => {
    service.setCurrentlySelectedBeamIndex(2);
    expect(service.getCurrentlySelectedBeamIndex()).toEqual(2);
  });

  it('should set & get static delete hidden', () => {
    service.setIsDeleteHiddenStatic(true);
    expect(service.getIsDeleteHiddenStatic()).toBeTruthy();
  });

  it('on calculate number of beam should return number of beams displayed', fakeAsync(() => {
    service.calculateNumberOfBeams();
    tick(10);
    service.getNumberOfBeams().subscribe((beamAngle) => {
      expect(beamAngle).toEqual(3);
    });
  }));

  it('on static input is recived should map and set angle for particular static beam', () => {
    service.mapAndSetStaticBeamInput(-45, 0);
    expect(service.staticBeams[0].angle).toBeCloseTo(-48.21428, 4);
  });

  it('on static input is recived out of range angle should map and set angle for a static beam', () => {
    service.staticBeams[0].minimumMovementAngle = -40;
    service.staticBeams[0].maximumMovementAngle = -50;
    service.mapAndSetStaticBeamInput(-45, 0);
    expect(service.staticBeams[0].angle).toBeCloseTo(-40, 4);
  });

  it('on static input is recived invalide angle should map and set angle to 180deg', () => {
    service.mapAndSetStaticBeamInput(70, 0);
    expect(service.staticBeams[0].angle).toBeCloseTo(180, 4);
  });

  it('on static beam type should assign amm state to static beams', () => {
    service.selectedBeamType = 'fixed';
    service.updateAmmState('1 0 0 -1 1');
    expect(service.staticBeams[0].amm).toEqual(1);
    expect(service.staticBeams[1].amm).toEqual(0);
    expect(service.staticBeams[2].amm).toEqual(0);
    expect(service.staticBeams[3].amm).toEqual(-1);
  });
});

describe('AngularP5Sevice Zones', () => {
  let angularService: AngularP5Service;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        AngularP5Service,
        { provide: DeviceDataManagerService, useClass: DeviceDataManagerServiceMock },
        { provide: Router, useValue: {} },
      ],
    }),
  );

  beforeEach(() => {
    angularService = TestBed.get(AngularP5Service);
    angularService.staticBeams[0].angle = 2;
    angularService.staticBeams[1].angle = -5;
    angularService.staticBeams[2].angle = 180;
    angularService.staticBeams[3].angle = 34;
  });

  it('should be created', () => {
    expect(angularService).toBeTruthy();
  });

  it('on adding 3rd zone should check available angle & send 3rd zone angles to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.setAddedZone();
    const uuid = angularService.zones[1].getZoneUUID('DELETE_ANGLE_UUID');
    expect(spySendToDevice).toBeCalledWith('update', { [uuid]: '1' });
    expect(spySendToDevice).toBeCalledTimes(2);
  });

  it('on adding 3rd zone should check available angle & send 3rd zone angles to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.deleteZone();
    const uuid = angularService.zones[1].getZoneUUID('DELETE_ANGLE_UUID');
    expect(spySendToDevice).toBeCalledWith('update', { [uuid]: '0' });
    expect(spySendToDevice).toBeCalledTimes(2);
  });

  it('on updating 1st Zone angle should send it to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.updateZoneBeamAngle(0);
    const uuid = angularService.zones[2].getZoneUUID('START_ANGLE_UUID');
    expect(spySendToDevice).toBeCalledWith('update', { [uuid]: '89' });
  });

  it('on updating 2nd Zone angle should send it to device', () => {
    const spySendToDeviceSend = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.updateZoneBeamAngle(2);
    const uuid = angularService.zones[0].getZoneUUID('END_ANGLE_UUID');
    expect(spySendToDeviceSend).toBeCalledWith('update', { [uuid]: '-89' });
  });

  it('on updating 2nd Zone angle should send it to device', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.zones[1].startAngle = -3;
    angularService.zones[1].endAngle = 4;
    angularService.updateZoneBeamAngle(1);
    const uuidStart = angularService.zones[1].getZoneUUID('START_ANGLE_UUID');
    const uuidEnd = angularService.zones[1].getZoneUUID('END_ANGLE_UUID');
    expect(spySendToDevice).toBeCalledWith('update', { [uuidStart]: '-4', [uuidEnd]: '3' });
  });

  it('check zone boundary and unoverlap the zone', () => {
    angularService.zones[2].startAngle = 70;
    angularService.zones[2].minimumMovementAngle = 75;

    angularService.zones[0].endAngle = -70;
    angularService.zones[0].maximumMovementAngle = -75;

    angularService.zones[1].startAngle = 10;
    angularService.zones[1].minimumMovementAngle = 15;
    angularService.zones[1].endAngle = -10;
    angularService.zones[1].maximumMovementAngle = -15;

    angularService.checkZonesAreInBoundary();
    expect(angularService.zones[2].startAngle).toEqual(angularService.zones[2].minimumMovementAngle);
    expect(angularService.zones[0].endAngle).toEqual(angularService.zones[0].maximumMovementAngle);
    expect(angularService.zones[1].startAngle).toEqual(angularService.zones[1].minimumMovementAngle);
    expect(angularService.zones[1].endAngle).toEqual(angularService.zones[1].maximumMovementAngle);
  });

  it('check 3rd zone overlaped or invalid values from other application', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.zones[1].startAngle = 10;
    angularService.zones[1].endAngle = -10;
    angularService.checkZoneOverlapped();
    expect(spySendToDevice).toBeCalledTimes(2);
  });

  it('check 3rd zone overlaped or invalid values from other application', () => {
    const spySendToDevice = spyOn(TestBed.get(DeviceDataManagerService), 'sendToDevice');
    angularService.zones[1].startAngle = 10;
    angularService.zones[1].endAngle = 15;
    angularService.checkZoneOverlapped();
    expect(spySendToDevice).toBeCalledTimes(1);
  });

  it('check default zones overlaped or invalid values from other application', () => {
    angularService.zones[0].endAngle = 30;
    angularService.zones[2].startAngle = 20;
    angularService.checkZoneOverlapped();
    expect(angularService.zones[0].endAngle).toBeCloseTo(angularService.zones[2].startAngle - 4, 3);
  });

  it('initialize the zone movement on 3rd zone present', fakeAsync(() => {
    angularService.zones[0].endAngle = -40;
    angularService.zones[2].startAngle = 30;

    angularService.zones[1].endAngle = 10;
    angularService.zones[1].startAngle = -5;

    angularService.selectedBeamType = 'dynamic';

    angularService.initializeMovementForZone();
    tick(10);
    expect(angularService.zones[0].maximumMovementAngle).toBeCloseTo(-6, 2);
    expect(angularService.zones[2].minimumMovementAngle).toBeCloseTo(11, 2);
    expect(angularService.zones[1].minimumMovementAngle).toBeCloseTo(-39, 2);
    expect(angularService.zones[1].maximumMovementAngle).toBeCloseTo(29, 2);
  }));

  it('check for space availablity to add zone', () => {
    angularService.zones[2].startAngle = 10;
    angularService.zones[0].endAngle = 7;
    angularService.isSpaceAvailableToAdd();
    expect(angularService.getIsPlaceToAddBeam()).toBeTruthy();
  });

  it('should set & get zone delete hidden', () => {
    angularService.setIsDeleteHiddenZone(true);
    expect(angularService.getIsDeleteHiddenZone()).toBeTruthy();
  });

  it('should return weather 3rd zone added', (done) => {
    angularService.beamDeleteButtonColor.next('rgb(23,67,78)');
    angularService.getBeamDeleteButtonColor().subscribe((color) => {
      expect(color).toEqual('rgb(23,67,78)');
    });
    done();
  });

  it('should set & get zone', () => {
    const zone = [new Zone(-90, -80, 'maximum'), new Zone(5, 17, 'both'), new Zone(80, 90, 'minimum')];
    angularService.setZones(zone);
    expect(angularService.getZones()).toEqual(zone);
  });

  it('should return weather 3rd zone added', (done) => {
    angularService.numberOfZones.next(3);
    angularService.isExlusionZoneAdded().subscribe((numberOfZones) => {
      expect(numberOfZones).toEqual(3);
    });
    done();
  });

  it('should set & get curently selected zone', () => {
    const zone = new Zone(5, 17, 'both');
    angularService.setCurrentlySelectedZone(zone);
    expect(angularService.getCurrentlySelectedZone()).toEqual(zone);
  });

  it('should set & get curently selected beam index', () => {
    angularService.setCurrentlySelectedZoneIndex(2);
    expect(angularService.getCurrentlySelectedZoneIndex()).toEqual(2);
  });

  it('should set & get room width', (done) => {
    angularService.setRoomWidth(5);
    angularService.getRoomWidth().subscribe((width) => {
      expect(width).toEqual(5);
    });
    done();
  });

  it('should set & get room depth', (done) => {
    angularService.setRoomDepth(15);
    angularService.getRoomDepth().subscribe((depth) => {
      expect(depth).toEqual(15);
    });
    done();
  });
});
