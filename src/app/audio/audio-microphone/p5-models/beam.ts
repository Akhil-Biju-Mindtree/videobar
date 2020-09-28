import { Triangle } from './triangle';
import * as p5Helper from '../beamsP5Helper';

export class Beam {
  angle: number;
  beamCoordinates: Triangle;
  beamIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  nonSelectesBeamColor: string;
  selectesBeamColor: string;
  beamUUID: string;
  minimumMovementAngle: number;
  maximumMovementAngle: number;
  amm: number;

  constructor(angle: number) {
    this.angle = angle;
    this.isSelected = false;
  }
  public getAngle(): number {
    return this.angle;
  }
  public setAngle(angle: number) {
    this.angle = angle;
  }
  public getBeamCoordinates(): Triangle {
    return this.beamCoordinates;
  }
  public setBeamCoordinates(beamCoordinates: Triangle) {
    this.beamCoordinates = beamCoordinates;
  }
  public getBeamIndex(): number {
    return this.beamIndex;
  }
  public setBeamIndex(beamIndex: number) {
    this.beamIndex = beamIndex;
  }
  public getIsSelected() {
    return this.isSelected;
  }
  public setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }
  public getIsHovered() {
    return this.isHovered;
  }
  public setIsHovered(isHovered: boolean) {
    this.isHovered = isHovered;
  }
  public getNonSelectesBeamColor() {
    return this.nonSelectesBeamColor;
  }
  public setNonSelectesBeamColor(nonSelectesBeamColor: string) {
    this.nonSelectesBeamColor = nonSelectesBeamColor;
  }
  public getSelectesBeamColor() {
    return this.selectesBeamColor;
  }
  public setSelectesBeamColor(selectesBeamColor: string) {
    this.selectesBeamColor = selectesBeamColor;
  }
  public getBeamUUID() {
    return this.beamUUID;
  }
  public setBeamUUID(uuid: string) {
    this.beamUUID = uuid;
  }
  public getMinimumMovementAngle() {
    return this.minimumMovementAngle;
  }
  public setMinimumMovementAngle(minimumMovementAngle: number) {
    this.minimumMovementAngle = minimumMovementAngle;
  }
  public getMaximumMovementAngle() {
    return this.maximumMovementAngle;
  }
  public setMaximumMovementAngle(maximumMovementAngle: number) {
    this.maximumMovementAngle = maximumMovementAngle;
  }
  public getAmm() {
    return this.amm;
  }
  public seAmm(amm: number) {
    this.amm = amm;
  }
}
