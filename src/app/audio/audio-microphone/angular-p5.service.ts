import { Injectable } from '@angular/core';
import { AudioMicrophoneModule } from './audio-microphone.module';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { Beam } from './p5-models/beam';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { AUDIO_CONSTANTS, staticBeamUUIDs, zonesUUIDs, ptzUUIDs } from '../audio.constant';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AppConstants, ALL_CONFIGURE_ROOM_UUIDS } from '@core/constants/app.constant';
import { Zone } from './p5-models/zone';
import { Router } from '@angular/router';
import * as p5Helper from './beamsP5Helper';

@Injectable({
  providedIn: AudioMicrophoneModule,
})
export class AngularP5Service {
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  selectedBeamType: string;
  // Dynamic Beams
  dynamicBeams: Beam[] = [];
  // Running Beam
  runningBeam: Beam = null;
  // Static Beams
  staticBeams: Beam[] = [];
  currentlySelectedBeam: Beam = null;
  currentlySelectedBeamIndex = -1;
  isDeleteHiddenStatic = true;
  // Zone Beams
  zones: Zone[] = [];
  currentlySelectedZone: Zone = null;
  currentlySelectedZoneIndex = -1;
  isDeleteHiddenZone = true;
  // Color Array
  availableBeamColorArray: string[] = [];
  availableUUIDs: string[] = [];
  deletedBeamIndises: number[] = [];
  beamDeleteButtonColor: BehaviorSubject<string> = new BehaviorSubject(null);
  roomWidth: BehaviorSubject<number> = new BehaviorSubject(this.microphoneConfigJson.meetingRoomConfig.width);
  roomDepth: BehaviorSubject<number> = new BehaviorSubject(this.microphoneConfigJson.meetingRoomConfig.depth);

  dynamicBeamDataSubscription: Subscription = new Subscription();
  ammStateSubscription: Subscription = new Subscription();
  beamTypeSubscription: Subscription = new Subscription();
  staticBeamSubscriptions: Subscription = new Subscription();
  numberOfBeams: BehaviorSubject<number> = new BehaviorSubject(0);
  numberOfZones: BehaviorSubject<number> = new BehaviorSubject(this.zones.length);
  isPlaceToAddBeam = false;
  constructor(private deviceDataManagerService: DeviceDataManagerService, private router: Router) {
    // Initialising Dynamic Beam and Static Beam
    this.beamsInit();
    // Initialising running Beam
    this.runningBeam = new Beam(0);
    // Setting the initial colors to the initialised beams
    this.setColorStaticBeams();
    // Initialising Zones
    this.zonesInit();
    // Initialize movements of zones and beams
    this.initBeamMovementProperties();
    this.initZoneMovementProperties();
  }

  // Getter Setter for Dynaimc Beams
  setDynamicBeams(dynamicBeams: Beam[]) {
    this.dynamicBeams = dynamicBeams;
  }
  getDynamicBeams(): Beam[] {
    return this.dynamicBeams;
  }
  // Getter Setter for Running Beams
  setRunningBeams(runningBeam: Beam) {
    this.runningBeam = runningBeam;
  }
  getRunningBeams(): Beam {
    return this.runningBeam;
  }
  // Getter Setter for Static Beams
  setStaticBeams(staticBeams: Beam[]) {
    this.staticBeams = staticBeams;
  }
  getStaticBeams(): Beam[] {
    return this.staticBeams;
  }
  setCurrentlySelectedBeam(currentlySelectedBeam: Beam) {
    this.currentlySelectedBeam = currentlySelectedBeam;
  }
  getCurrentlySelectedBeam(): Beam {
    return this.currentlySelectedBeam;
  }
  setCurrentlySelectedBeamIndex(currentlySelectedBeamIndex: number) {
    this.currentlySelectedBeamIndex = currentlySelectedBeamIndex;
  }
  getCurrentlySelectedBeamIndex(): number {
    return this.currentlySelectedBeamIndex;
  }
  // Getter Setter for NumberOfBeams
  setNumberOfBeams(numberOfBeams: number) {
    this.numberOfBeams.next(numberOfBeams);
  }
  getNumberOfBeams(): BehaviorSubject<number> {
    return this.numberOfBeams;
  }
  setRoomWidth(roomWidth: number) {
    this.roomWidth.next(roomWidth);
  }
  getRoomWidth(): BehaviorSubject<number> {
    return this.roomWidth;
  }
  setRoomDepth(roomDepth: number) {
    this.roomDepth.next(roomDepth);
  }
  getRoomDepth(): BehaviorSubject<number> {
    return this.roomDepth;
  }
  // Getter Setter for Zones[]
  setZones(zones: Zone[]) {
    this.zones = zones;
  }
  getZones(): Zone[] {
    return this.zones;
  }
  isExlusionZoneAdded(): BehaviorSubject<number> {
    return this.numberOfZones;
  }
  setCurrentlySelectedZone(currentlySelectedZone: Zone) {
    this.currentlySelectedZone = currentlySelectedZone;
  }
  getCurrentlySelectedZone(): Zone {
    return this.currentlySelectedZone;
  }
  setCurrentlySelectedZoneIndex(currentlySelectedZoneIndex: number) {
    this.currentlySelectedZoneIndex = currentlySelectedZoneIndex;
  }
  getCurrentlySelectedZoneIndex(): number {
    return this.currentlySelectedZoneIndex;
  }
  setIsDeleteHiddenStatic(isDeleteHiddenStatic: boolean) {
    this.isDeleteHiddenStatic = isDeleteHiddenStatic;
  }
  getIsDeleteHiddenStatic(): boolean {
    return this.isDeleteHiddenStatic;
  }
  setIsDeleteHiddenZone(isDeleteHiddenZone: boolean) {
    this.isDeleteHiddenZone = isDeleteHiddenZone;
  }
  getIsDeleteHiddenZone(): boolean {
    return this.isDeleteHiddenZone;
  }
  setIsPlaceToAddBeam(isPlaceToAddBeam: boolean) {
    this.isPlaceToAddBeam = isPlaceToAddBeam;
  }
  getIsPlaceToAddBeam(): boolean {
    return this.isPlaceToAddBeam;
  }
  setSelectedBeamType(selectedBeamType: string) {
    this.selectedBeamType = selectedBeamType;
  }
  getSelectedBeamType(): string {
    return this.selectedBeamType;
  }
  /** To get selected beam color for detete button background */
  setBeamDeleteButtonColor(beamDeleteButtonColor: string) {
    this.beamDeleteButtonColor.next(beamDeleteButtonColor);
  }
  getBeamDeleteButtonColor(): BehaviorSubject<string> {
    return this.beamDeleteButtonColor;
  }
  // Function to initialise Dynamic and static beams
  beamsInit() {
    for (let i = 0; i < AUDIO_CONSTANTS.BEAMS.MAX_NUMBER_OF_STATIC_BEAMS; i += 1) {
      this.dynamicBeams.push(new Beam(this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle));
      this.staticBeams.push(new Beam(this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle));
    }
  }
  initBeamMovementProperties() {
    this.checkBeamOverlapped();
    this.initializeMovementForBeam();
  }
  initZoneMovementProperties() {
    this.checkZoneOverlapped();
    this.initializeMovementForZone();
    this.isSpaceAvailableToAdd();
  }
  // Function to set the colors of the initialised beams
  setColorStaticBeams() {
    for (let i = 0; i < this.staticBeams.length; i += 1) {
      this.staticBeams[i].setNonSelectesBeamColor(this.microphoneConfigJson.beamComponent.beamColours.notSelected[i]);
      this.staticBeams[i].setSelectesBeamColor(this.microphoneConfigJson.beamComponent.beamColours.Selected[i]);
      this.staticBeams[i].setBeamUUID(staticBeamUUIDs.UUID_ARRAY[i]);
    }
  }
  /**************************
   * Api functions to update
   * current Static/Dynamic
   * route state.
   *************************/
  subscribeToBeamTypeData() {
    this.beamTypeSubscription = this.deviceDataManagerService
      .listenFromDevice(AUDIO_CONSTANTS.UUID.BEAM_TYPE)
      .subscribe((beamType: string) => {
        this.setSelectedBeamType(beamType);
        this.clearAllSelection();
        if (beamType === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC) {
          this.router.navigateByUrl(`audio/microphones/dynamic-beams`);
        } else {
          this.router.navigateByUrl(`audio/microphones/static-beams`);
        }
      });
  }

  subscribeToAmmData() {
    this.ammStateSubscription = this.deviceDataManagerService
      .listenFromDevice(AUDIO_CONSTANTS.UUID.GET_AMM_STATE)
      .subscribe((ammState: string) => {
        this.updateAmmState(ammState);
      });
  }

  unsubscribeBeamTypeData() {
    this.beamTypeSubscription.unsubscribe();
  }
  unsubscribeAmmData() {
    this.ammStateSubscription.unsubscribe();
  }
  updateBeamTypeData(beamType: string) {
    const uuid = AUDIO_CONSTANTS.UUID.BEAM_TYPE;
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, { [uuid]: `${beamType}` });
    this.setSelectedBeamType(beamType);
    this.initBeamMovementProperties();
    this.initZoneMovementProperties();
    this.clearAllSelection();
  }
  /******************* END *********************/
  /**************************
   * Dynamic Beam Functions
   *************************/
  // Funtion to subsribe to dynamic beams data
  subscribeToDynamicBeamData() {
    this.dynamicBeamDataSubscription = this.deviceDataManagerService
      .listenFromDevice(AUDIO_CONSTANTS.UUID.GET_DYNAMIC_BEAM_ANGLES)
      .subscribe((value: string) => {
        this.updateDynamicBeams(value);
      });
  }

  unSubscribeToDynamicBeamData() {
    this.dynamicBeamDataSubscription.unsubscribe();
  }
  // Update function to update the dynamic beam value with the api beam angles
  // First 4 beams are Dynamic Beam Values and the 5th one is running beam value
  updateDynamicBeams(dynamicBeamsString: string) {
    if (dynamicBeamsString !== null && dynamicBeamsString !== undefined) {
      const newDynamicBeamsValue: string[] = dynamicBeamsString.split(' ');
      // Updating Dynamic beam value
      let i = 0;
      let newBeamAngle = 0;
      for (; i < newDynamicBeamsValue.length - 1; i += 1) {
        newBeamAngle = parseInt(newDynamicBeamsValue[i], 10);
        if (
          newDynamicBeamsValue[i] !== AUDIO_CONSTANTS.BEAMS.DYNAMIC_BEAM_DISABLED &&
          newBeamAngle !== NaN &&
          newBeamAngle >= AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE[0] &&
          newBeamAngle <= AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE[1]
        ) {
          this.dynamicBeams[i].setAngle(-p5Helper.default.mapInputRanges(newBeamAngle));
        } else {
          this.dynamicBeams[i].setAngle(this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
        }
      }
      // Updating the Runing beam value
      newBeamAngle = parseInt(newDynamicBeamsValue[i], 10);
      if (
        newDynamicBeamsValue[i] !== AUDIO_CONSTANTS.BEAMS.DYNAMIC_BEAM_DISABLED &&
        newBeamAngle !== NaN &&
        newBeamAngle >= AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE[0] &&
        newBeamAngle <= AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE[1]
      ) {
        this.runningBeam.setAngle(-p5Helper.default.mapInputRanges(newBeamAngle));
      } else {
        this.runningBeam.setAngle(this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
      }
    }
  }

  updateAmmState(ammState: string) {
    if (ammState !== null && ammState !== undefined) {
      const newAmmState: string[] = ammState.split(' ');
      let i = 0;
      if (this.selectedBeamType === AUDIO_CONSTANTS.BEAM_TYPES.STATIC) {
        for (; i < newAmmState.length - 1; i += 1) {
          this.staticBeams[i].amm = Number(newAmmState[i]);
        }
      } else {
        for (; i < newAmmState.length - 1; i += 1) {
          this.dynamicBeams[i].amm = Number(newAmmState[i]);
        }
        this.runningBeam.amm = Number(newAmmState[i]);
      }
    }
  }
  /******************* END *********************/
  /**************************
   * Static Beam Functions
   *************************/
  /**
   * Algoritha to determin the angle of the new beam to to be added
   * So that the new beam whenc added do not overlap any of the existing beams
   * TODO: Algorithm should be modified so that Existing zones are also considered
   * so that the new beams do not get add in the exclution zones.
   * TODO: Reduce Cognitive Complexity
   * */
  getAddBeamAngle(): number {
    const secAngle = 0;
    const minimumAngle =
      this.microphoneConfigJson.beamComponent.beamConstrain.minimumAngle +
      this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle;
    const maximumAngle =
      this.microphoneConfigJson.beamComponent.beamConstrain.maximumAngle -
      this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle;
    let i = this.getAvailableAngleForBeam(secAngle, maximumAngle);
    if (i > maximumAngle) {
      i = this.getAvailableAngleForBeam(minimumAngle, secAngle);
    }
    return i;
  }
  getAvailableAngleForBeam(startAngle: number, endAngle: number) {
    let i = startAngle;
    let noOverlapCount = 0;
    for (; i <= endAngle; i += 1) {
      for (let j = 0; j < this.staticBeams.length; j += 1) {
        if (
          Math.abs(i - this.staticBeams[j].getAngle()) < this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle
        ) {
          break;
        } else {
          noOverlapCount += 1;
        }
      }
      if (noOverlapCount === this.staticBeams.length) {
        break;
      }
      noOverlapCount = 0;
    }
    return i;
  }
  getAddedZoneAngleInDynamic(): number {
    return (this.zones[2].getStartAngle() + this.zones[0].getEndAngle()) / 2;
  }
  isStaticBeamDeleted(uuid: string) {
    if (this.availableUUIDs.length === 0) {
      return false;
    }
    for (let i = 0; i < this.availableUUIDs.length; i += 1) {
      if (this.availableUUIDs[i] === uuid) {
        return true;
      }
    }
    return false;
  }
  // Mapping the 3rd zone angles for with input range
  mapAndSetStaticBeamInput(newBeamAngle: number, beamIndextoBeSet: number) {
    if (
      newBeamAngle !== NaN &&
      newBeamAngle >= AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE[0] &&
      newBeamAngle <= AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE[1]
    ) {
      let newAngle = p5Helper.default.mapInputRanges(newBeamAngle);
      if (
        newAngle > this.staticBeams[beamIndextoBeSet].getMaximumMovementAngle() &&
        newAngle < this.staticBeams[beamIndextoBeSet].getMinimumMovementAngle()
      ) {
        newAngle =
          newAngle - this.staticBeams[beamIndextoBeSet].getMaximumMovementAngle() <
          newAngle - this.staticBeams[beamIndextoBeSet].getMinimumMovementAngle()
            ? this.staticBeams[beamIndextoBeSet].getMaximumMovementAngle()
            : this.staticBeams[beamIndextoBeSet].getMinimumMovementAngle();
      }
      this.staticBeams[beamIndextoBeSet].setAngle(newAngle);
    } else {
      this.staticBeams[beamIndextoBeSet].setAngle(
        this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle,
      );
    }
  }
  // Function to update the beam angle to Raphael
  updateStaticBeamAngle(beamIndexToBeUpdated: number) {
    const uuid = this.staticBeams[beamIndexToBeUpdated].getBeamUUID();
    let newBeamAngle = this.staticBeams[beamIndexToBeUpdated].getAngle();
    if (newBeamAngle !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) {
      newBeamAngle = -p5Helper.default.round(p5Helper.default.mapOutputRange(newBeamAngle));
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, { [uuid]: `${newBeamAngle}` });
      /** Re ordering the static beams according to their UUIDs */
      for (let i = 0; i < this.staticBeams.length; i += 1) {
        if (this.staticBeams[i].getBeamUUID() !== staticBeamUUIDs.UUID_ARRAY[i]) {
          for (let j = i + 1; j < this.staticBeams.length; j += 1) {
            if (this.staticBeams[i].getBeamUUID() === staticBeamUUIDs.UUID_ARRAY[j]) {
              const temp = this.staticBeams[i];
              this.staticBeams[i] = this.staticBeams[j];
              this.staticBeams[j] = temp;
            }
          }
        }
      }
    }
  }
  // Function to delte based on the selected beam index from the canvas and the Raphael
  deleteBeam(beamIndexToBeDeleted: number) {
    setTimeout(() => {
      const uuid = this.staticBeams[beamIndexToBeDeleted].getBeamUUID();
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
        [uuid]: AUDIO_CONSTANTS.BEAMS.STATIC_BEAM_DISABLED,
      });
      this.staticBeams[beamIndexToBeDeleted].setAngle(
        this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle,
      );
      this.staticBeams[beamIndexToBeDeleted].setIsSelected(false);
    });
  }
  calculateNumberOfBeams() {
    setTimeout(() => {
      let numberOfBeams = 0;
      for (let i = 0; i < this.staticBeams.length; i += 1) {
        if (this.staticBeams[i].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) {
          numberOfBeams += 1;
        }
      }
      this.setNumberOfBeams(numberOfBeams);
    });
  }
  // Function to add new beam to the canvas
  addBeam() {
    let newBeamAngle = this.getAddBeamAngle();
    newBeamAngle = -p5Helper.default.round(p5Helper.default.mapOutputRange(newBeamAngle));
    this.clearAllSelection();
    const beamIndexToBeUpdated = this.deletedBeamIndises.splice(0, 1)[0];
    this.staticBeams[beamIndexToBeUpdated].setIsSelected(true);
    this.setBeamDeleteButtonColor(this.staticBeams[beamIndexToBeUpdated].getSelectesBeamColor());
    this.isDeleteHiddenStatic = false;
    this.currentlySelectedBeam = this.staticBeams[beamIndexToBeUpdated];
    this.currentlySelectedBeamIndex = beamIndexToBeUpdated;
    const uuid = this.staticBeams[beamIndexToBeUpdated].getBeamUUID();
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, { [uuid]: `${newBeamAngle}` });
    this.initBeamMovementProperties();
  }
  // Retrive Satic Beams Data from Raphael
  retriveStaticBeamData() {
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Retrieve, staticBeamUUIDs.allUUIDs);
  }

  /******************* END *********************/
  /**************************
   * Zone Functions
   *************************/
  zonesInit() {
    // Zone One
    this.zones.push(
      new Zone(
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle,
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneRestrictedMinimum,
        AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MAXIMUM,
      ),
    );
    this.zones[0].setZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_ONE);
    // Zone Two
    this.zones.push(
      new Zone(
        this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle,
        this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle,
        AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH,
      ),
    );
    this.zones[1].setZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_TWO);
    this.zones[1].setToBeDraggedAngle(AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.ENABLE_BOTH);
    // Zone Three
    this.zones.push(
      new Zone(
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneRestrictedMaximum,
        this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle,
        AUDIO_CONSTANTS.ZONES.DRAG_HANDLES.MINIMUM,
      ),
    );
    this.zones[2].setZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_UUIDS.ZONE_THREE);
    // Setting color
    for (let i = 0; i < AUDIO_CONSTANTS.ZONES.MAX_NUMBER_OF_ZONES; i += 1) {
      this.zones[i].setNonSelectedZoneColor(this.microphoneConfigJson.zoneComponent.zoneColours.notSelected);
      this.zones[i].setSelectesZoneColor(this.microphoneConfigJson.zoneComponent.zoneColours.Selected);
      this.zones[i].setIsSelected(false);
    }
  }
  setAddedZone() {
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.zones[1].getZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_KEYS.DELETE_ANGLE)]: '1',
    });
    const minAngle = -p5Helper.default.round(
      p5Helper.default.mapZoneOutputRange(
        this.getAddedZoneAngleInDynamic() - this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle / 2,
      ),
    );
    const maxAngle = -p5Helper.default.round(
      p5Helper.default.mapZoneOutputRange(
        this.getAddedZoneAngleInDynamic() + this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle / 2,
      ),
    );
    this.clearAllSelection();
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.zones[1].getZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE)]: `${maxAngle}`,
      [this.zones[1].getZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE)]: `${minAngle}`,
    });
    this.initZoneMovementProperties();
    this.zones[1].setIsSelected(true);
    this.isDeleteHiddenZone = false;
    this.currentlySelectedZone = this.zones[1];
  }
  deleteZone() {
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.zones[1].getZoneUUID(
        AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE,
      )]: `${this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle}`,
      [this.zones[1].getZoneUUID(
        AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE,
      )]: `${this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle}`,
    });
    this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
      [this.zones[1].getZoneUUID(AUDIO_CONSTANTS.ZONES.ZONE_KEYS.DELETE_ANGLE)]: '0',
    });
    this.zones[1].setStartAngle(this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
    this.zones[1].setEndAngle(this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
    this.zones[1].setIsSelected(false);
    this.isDeleteHiddenZone = true;
    this.initZoneMovementProperties();
  }
  updateZoneBeamAngle(zoneIndexToBeUpdated: number) {
    if (zoneIndexToBeUpdated === 0) {
      const uuid = this.zones[AUDIO_CONSTANTS.ZONES.MAX_NUMBER_OF_ZONES - 1 - zoneIndexToBeUpdated].getZoneUUID(
        AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE,
      );
      const newAngle = -p5Helper.default.round(
        p5Helper.default.mapZoneOutputRange(this.zones[zoneIndexToBeUpdated].getEndAngle()),
      );
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, { [uuid]: `${newAngle}` });
    } else if (zoneIndexToBeUpdated === 1) {
      const uuidOne = this.zones[AUDIO_CONSTANTS.ZONES.MAX_NUMBER_OF_ZONES - 1 - zoneIndexToBeUpdated].getZoneUUID(
        AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE,
      );
      const uuidTwo = this.zones[AUDIO_CONSTANTS.ZONES.MAX_NUMBER_OF_ZONES - 1 - zoneIndexToBeUpdated].getZoneUUID(
        AUDIO_CONSTANTS.ZONES.ZONE_KEYS.START_ANGLE,
      );
      const newAngleOne = -p5Helper.default.round(
        p5Helper.default.mapZoneOutputRange(this.zones[zoneIndexToBeUpdated].getStartAngle()),
      );
      const newAngleTwo = -p5Helper.default.round(
        p5Helper.default.mapZoneOutputRange(this.zones[zoneIndexToBeUpdated].getEndAngle()),
      );
      if (
        p5Helper.default.round(newAngleOne) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        p5Helper.default.round(newAngleTwo) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
      ) {
        this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, {
          [uuidOne]: `${newAngleOne}`,
          [uuidTwo]: `${newAngleTwo}`,
        });
      }
    } else if (zoneIndexToBeUpdated === 2) {
      const uuid = this.zones[AUDIO_CONSTANTS.ZONES.MAX_NUMBER_OF_ZONES - 1 - zoneIndexToBeUpdated].getZoneUUID(
        AUDIO_CONSTANTS.ZONES.ZONE_KEYS.END_ANGLE,
      );
      const newAngle = -p5Helper.default.round(
        p5Helper.default.mapZoneOutputRange(this.zones[zoneIndexToBeUpdated].getStartAngle()),
      );
      this.deviceDataManagerService.sendToDevice(AppConstants.Action.Update, { [uuid]: `${newAngle}` });
    }
  }
  /******************* END *********************/
  clearAllSelection() {
    this.zones.forEach((zone: Zone) => {
      zone.setIsSelected(false);
    });
    this.staticBeams.forEach((staticBeam: Beam) => {
      staticBeam.setIsSelected(false);
    });
    this.currentlySelectedBeam = null;
    this.currentlySelectedBeamIndex = -1;
    this.currentlySelectedZone = null;
    this.currentlySelectedZoneIndex = -1;
    this.isDeleteHiddenZone = true;
    this.isDeleteHiddenStatic = true;
  }
  /** To Check zones are always in boundary */
  checkZonesAreInBoundary() {
    this.zones.forEach((zone: Zone, index: number) => {
      if (
        index === 2 &&
        Math.abs(zone.getStartAngle()) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        zone.getStartAngle() < zone.getMinimumMovementAngle()
      ) {
        zone.setStartAngle(zone.getMinimumMovementAngle());
      } else if (
        index === 0 &&
        Math.abs(zone.getEndAngle()) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        zone.getEndAngle() > zone.getMaximumMovementAngle()
      ) {
        zone.setEndAngle(zone.getMaximumMovementAngle());
      } else if (
        index === 1 &&
        Math.abs(zone.getStartAngle()) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        Math.abs(zone.getEndAngle()) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
      ) {
        if (zone.getStartAngle() < zone.getMinimumMovementAngle()) {
          zone.setStartAngle(zone.getMinimumMovementAngle());
        }
        if (zone.getEndAngle() > zone.getMaximumMovementAngle()) {
          zone.setEndAngle(zone.getMaximumMovementAngle());
        }
      }
    });
  }
  /** To Check static beams are always in boundary */
  checkStaticBeamsInBoundary() {
    this.staticBeams.forEach((beam: Beam) => {
      if (
        beam.getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        beam.getMinimumMovementAngle() === beam.getMaximumMovementAngle() &&
        beam.getAngle() !== beam.getMinimumMovementAngle()
      ) {
        beam.setAngle(beam.getMinimumMovementAngle());
        this.initBeamMovementProperties();
      }
      if (
        beam.getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        beam.getAngle() < beam.getMinimumMovementAngle() &&
        Math.abs(beam.getAngle() - beam.getMinimumMovementAngle()) < 1
      ) {
        beam.setAngle(beam.getMinimumMovementAngle());
        this.initBeamMovementProperties();
      }
      if (
        beam.getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        beam.getAngle() > beam.getMaximumMovementAngle() &&
        Math.abs(beam.getAngle() - beam.getMaximumMovementAngle()) < 1
      ) {
        beam.setAngle(beam.getMaximumMovementAngle());
        this.initBeamMovementProperties();
      }
    });
  }
  /** Check zones are overlapped each other from mgmt application */
  checkZoneOverlapped() {
    if (
      Math.abs(this.zones[1].getStartAngle()) !==
        this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
      Math.abs(this.zones[1].getEndAngle()) !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
      (this.zones[1].getStartAngle() < this.zones[0].getEndAngle() ||
        this.zones[1].getEndAngle() > this.zones[2].getStartAngle() ||
        this.zones[1].getStartAngle() > this.zones[1].getEndAngle())
    ) {
      this.deleteZone();
    } else if (
      this.zones[1].getStartAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
      this.zones[1].getEndAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
      Math.abs(this.zones[1].getEndAngle() - this.zones[1].getStartAngle()) <
        this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle - 1 &&
      Math.abs(this.zones[1].getEndAngle() - this.zones[1].getStartAngle()) >= 0
    ) {
      const difference =
        this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle -
        Math.abs(this.zones[1].getEndAngle() - this.zones[1].getStartAngle());
      this.zones[1].setStartAngle(this.zones[1].getStartAngle() - difference / 2);
      this.zones[1].setEndAngle(this.zones[1].getEndAngle() + difference / 2);
      this.updateZoneBeamAngle(1);
    }
    if (
      this.zones[0].getEndAngle() > this.zones[2].getStartAngle() ||
      (this.zones[1].getStartAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        this.zones[1].getEndAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        this.zones[0].getEndAngle() > this.zones[1].getStartAngle())
    ) {
      this.zones[0].setEndAngle(
        this.zones[1].getStartAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
          ? this.zones[1].getStartAngle()
          : this.zones[2].getStartAngle() - this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle / 2,
      );
    }
    if (
      this.zones[2].getStartAngle() < this.zones[0].getEndAngle() ||
      (this.zones[1].getEndAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        this.zones[1].getStartAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
        this.zones[2].getStartAngle() < this.zones[1].getEndAngle())
    ) {
      this.zones[2].setStartAngle(
        this.zones[1].getEndAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle
          ? this.zones[1].getEndAngle()
          : this.zones[0].getEndAngle() + this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle / 2,
      );
    }
  }
  /** Check static beams are overlapped each other from mgmt application */
  checkBeamOverlapped() {
    for (let i = 0; i < this.staticBeams.length - 1; i += 1) {
      for (let j = i + 1; j < this.staticBeams.length; j += 1) {
        if (
          this.staticBeams[i].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          this.staticBeams[j].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          Math.abs(this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle()) <
            this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle - 1
        ) {
          this.deleteBeam(i);
        }
      }
    }
  }
  /** Initialising movement of a static beam with the help of minimumMovementAngle & maxiMumMovementAngle */
  initializeMovementForBeam() {
    const zoneAngleToConsider = 2 * this.microphoneConfigJson.beamComponent.beamConstrain.minimumAngle;
    for (let i = 0; i < this.staticBeams.length; i += 1) {
      let leftMovementNearestValue = zoneAngleToConsider;
      let rightMovmentNearestValue = 0 - zoneAngleToConsider;
      let nearestLeftStaticBeamAngle = this.microphoneConfigJson.beamComponent.beamConstrain.maximumAngle;
      let nearestRightStaticBeamAngle = this.microphoneConfigJson.beamComponent.beamConstrain.minimumAngle;
      for (let j = 0; j < this.staticBeams.length; j += 1) {
        if (
          i !== j &&
          this.staticBeams[i].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          this.staticBeams[j].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle() < rightMovmentNearestValue &&
          this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle() >= 0
        ) {
          rightMovmentNearestValue = this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle();
          nearestRightStaticBeamAngle = this.staticBeams[j].getAngle();
        }
        if (
          i !== j &&
          this.staticBeams[i].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          this.staticBeams[j].getAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
          this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle() > leftMovementNearestValue &&
          this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle() <= 0
        ) {
          leftMovementNearestValue = this.staticBeams[i].getAngle() - this.staticBeams[j].getAngle();
          nearestLeftStaticBeamAngle = this.staticBeams[j].getAngle();
        }
      }
      this.staticBeams[i].setMinimumMovementAngle(
        nearestRightStaticBeamAngle + this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle,
      );
      this.staticBeams[i].setMaximumMovementAngle(
        nearestLeftStaticBeamAngle - this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle,
      );
    }
  }
  /** Initialising movement of Zones with the help of minimumMovementAngle & maxiMumMovementAngle */
  initializeMovementForZone() {
    let leftZoneNearestBeamAngle = this.zones[0].getEndAngle() + 1;
    let rightZoneNearestBeamAngle = this.zones[2].getStartAngle() - 1;
    if (
      this.zones[1].getStartAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
      this.zones[1].getEndAngle() !== this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle &&
      this.selectedBeamType === AUDIO_CONSTANTS.BEAM_TYPES.DYNAMIC
    ) {
      rightZoneNearestBeamAngle = this.zones[1].getStartAngle() - 1;
      leftZoneNearestBeamAngle = this.zones[1].getEndAngle() + 1;
      this.forZoneThreeMovementInit();
    }
    this.zones[0].setMinimumMovementAngle(
      this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneRestrictedMinimum,
    );
    this.zones[0].setMaximumMovemetAngle(p5Helper.default.round(rightZoneNearestBeamAngle));
    this.zones[2].setMinimumMovementAngle(p5Helper.default.round(leftZoneNearestBeamAngle));
    this.zones[2].setMaximumMovemetAngle(this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneRestrictedMaximum);
  }

  forZoneThreeMovementInit() {
    this.zones[1].setMaximumMovemetAngle(p5Helper.default.round(this.zones[2].getStartAngle() - 1));
    this.zones[1].setMinimumMovementAngle(p5Helper.default.round(this.zones[0].getEndAngle() + 1));
  }
  /** Is Space available to add 3rd Zone */
  isSpaceAvailableToAdd() {
    let retVal = false;
    if (
      this.zones[2].getStartAngle() - this.zones[0].getEndAngle() <=
      this.microphoneConfigJson.beamComponent.beamConstrain.beamAngle
    ) {
      retVal = true;
    }
    this.setIsPlaceToAddBeam(retVal);
  }
}
