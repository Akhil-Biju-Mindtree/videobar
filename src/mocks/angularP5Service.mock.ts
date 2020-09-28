import { of } from 'rxjs/internal/observable/of';
import { Beam } from 'app/audio/audio-microphone/p5-models/beam';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Zone } from 'app/audio/audio-microphone/p5-models/zone';

export class MockAngularP5Service {
  dynamicBeam = [new Beam(1), new Beam(10), new Beam(-10), new Beam(45)];
  runningBeam = new Beam(4);
  notSelected = [
    'rgba(0, 171, 113, 0.45)',
    'rgba(255, 4, 101, 0.45)',
    'rgba(0, 164, 214, 0.45)',
    'rgba(139, 110, 177, 0.45)',
  ];
  staticBeam = [new Beam(1), new Beam(10), new Beam(-10), new Beam(45)];
  Selected = ['rgba(0, 171, 113, 0.9)', 'rgba(255, 4, 101, 0.9)', 'rgba(0, 164, 214, 0.9)', 'rgba(139, 110, 177, 0.9)'];
  zone = [new Zone(-90, -80, 'maximum'), new Zone(5, 17, 'both'), new Zone(80, 90, 'minimum')];

  initDynamic = () => {
    for (let i = 0; i < this.dynamicBeam.length; i += 1) {
      this.dynamicBeam[i].setNonSelectesBeamColor(this.notSelected[i]);
    }

    this.dynamicBeam[0].amm = 1;
    this.dynamicBeam[1].amm = 0;
    this.dynamicBeam[2].amm = -1;
    this.dynamicBeam[3].amm = 1;
  }
  initStatic = () => {
    for (let i = 0; i < this.staticBeam.length; i += 1) {
      this.staticBeam[i].setNonSelectesBeamColor(this.notSelected[i]);
      this.staticBeam[i].setSelectesBeamColor(this.Selected[i]);
    }
    this.staticBeam[0].amm = 1;
    this.staticBeam[0].minimumMovementAngle = -7;
    this.staticBeam[0].maximumMovementAngle = 7;

    this.staticBeam[1].amm = 0;
    this.staticBeam[1].minimumMovementAngle = 4;
    this.staticBeam[1].maximumMovementAngle = 42;

    this.staticBeam[2].amm = -1;
    this.staticBeam[2].minimumMovementAngle = -89;
    this.staticBeam[2].maximumMovementAngle = -2;

    this.staticBeam[3].amm = 1;
    this.staticBeam[3].minimumMovementAngle = 13;
    this.staticBeam[3].maximumMovementAngle = 89;
  }
  initZone = () => {
    this.zone.forEach((zone) => {
      zone.setNonSelectedZoneColor('rgba(171, 171, 171, 1)');
      zone.setSelectesZoneColor('rgba(171, 171, 171, 1)');
    });
    this.zone[0].minimumMovementAngle = -90;
    this.zone[0].maximumMovementAngle = -70;

    this.zone[1].minimumMovementAngle = -7;
    this.zone[1].maximumMovementAngle = 24;

    this.zone[2].minimumMovementAngle = 70;
    this.zone[2].maximumMovementAngle = 90;
  }

  getZones = () => this.zone;
  getRoomDepth = () => of('');
  getRoomWidth = () => of('');
  getStaticBeams = () => this.staticBeam;
  getDynamicBeams = () => this.dynamicBeam;
  getRunningBeams = () => this.runningBeam;
  getNumberOfBeams = () => new BehaviorSubject<number>(3);
  updateBeamTypeData = () => of('');
  getSelectedBeamType = () => 'dynamic';
  updateZoneBeamAngle = () => of('');
  retriveStaticBeamData = () => of('');
  updateStaticBeamAngle = () => of('');
  setIsDeleteHiddenZone = () => of('');
  calculateNumberOfBeams = () => of('');
  setIsDeleteHiddenStatic = () => of('');
  setBeamDeleteButtonColor = () => of('');
  getCurrentlySelectedBeam = () => this.staticBeam[1];
  setCurrentlySelectedBeam = () => {};
  setCurrentlySelectedZone = () => of('');
  getCurrentlySelectedZone = () => {
    return this.zone[1];
  }
  subscribeToDynamicBeamData = () => of('');
  unSubscribeToDynamicBeamData = () => of('');
  setCurrentlySelectedBeamIndex = () => of('');
  getCurrentlySelectedBeamIndex = () => 1;
  setCurrentlySelectedZoneIndex = () => of('');
  getCurrentlySelectedZoneIndex = () => 1;
}
