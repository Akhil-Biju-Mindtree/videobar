import { Triangle } from './triangle';
import { Coordinate } from './coordinate';
import * as p5Helper from '../beamsP5Helper';

export class Zone {
  startAngle: number;
  endAngle: number;
  zoneBeamAngle: number;
  zoneCoordinates: Triangle;
  zoneIndex: number;
  selectorCircleCoordinate: Coordinate[];
  sideLineCoordinates: Coordinate[];
  isSelected: boolean;
  isHovered: boolean;
  nonSelectedZoneColor: string;
  selectedZoneColor: string;
  zoneUUID: object;
  enabledDragHandle: string;
  toBeDraggedAngle: string;
  minimumMovementAngle: number;
  maximumMovementAngle: number;

  constructor(startAngle: number, endAngle: number, enabledDragHandle: string) {
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.enabledDragHandle = enabledDragHandle;
  }

  // Getters and Setters
  public getStartAngle(): number {
    return this.startAngle;
  }
  public setStartAngle(startAngle: number) {
    this.startAngle = p5Helper.default.round(startAngle);
  }
  public getEndAngle(): number {
    return this.endAngle;
  }
  public getZoneBeamAngle(): number {
    return this.zoneBeamAngle;
  }
  public setZoneBeamAngle(zoneBeamAngle: number) {
    this.zoneBeamAngle = zoneBeamAngle;
  }
  public setEndAngle(endAngle: number) {
    this.endAngle = p5Helper.default.round(endAngle);
  }
  public getZoneCoordinates(): Triangle {
    return this.zoneCoordinates;
  }
  public setZoneCoordinates(zoneCoordinates: Triangle) {
    this.zoneCoordinates = zoneCoordinates;
  }
  public getZoneIndex(): number {
    return this.zoneIndex;
  }
  public setZoneIndex(zoneIndex: number) {
    this.zoneIndex = zoneIndex;
  }
  public getIsSelected(): boolean {
    return this.isSelected;
  }
  public setIsSelected(isSelected: boolean) {
    this.isSelected = isSelected;
  }
  public getIsHovered(): boolean {
    return this.isHovered;
  }
  public setIsHovered(isHovered: boolean) {
    this.isHovered = isHovered;
  }
  public getNonSelectedZoneColor(): string {
    return this.nonSelectedZoneColor;
  }
  public setNonSelectedZoneColor(nonSelectedZoneColor: string) {
    this.nonSelectedZoneColor = nonSelectedZoneColor;
  }
  public getSelectedZoneColor(): string {
    return this.selectedZoneColor;
  }
  public setSelectesZoneColor(selectesZoneColor: string) {
    this.selectedZoneColor = selectesZoneColor;
  }
  public getZoneUUID(key): string {
    return this.zoneUUID[key];
  }
  public setZoneUUID(zoneUUID: object) {
    this.zoneUUID = zoneUUID;
  }
  public getSelectorCircleCoordinate(): Coordinate[] {
    return this.selectorCircleCoordinate;
  }
  public setSelectorCircleCoordinate(selectorCircleCoordinate: Coordinate[]) {
    this.selectorCircleCoordinate = selectorCircleCoordinate;
  }
  public getEnabledDragHandle(): string {
    return this.enabledDragHandle;
  }
  public setEnabledDragHandle(enabledDragHandle: string) {
    this.enabledDragHandle = enabledDragHandle;
  }
  public getToBeDraggedAngle(): string {
    return this.toBeDraggedAngle;
  }
  public setToBeDraggedAngle(toBeDraggedAngle: string) {
    this.toBeDraggedAngle = toBeDraggedAngle;
  }
  public getMinimumMovementAngle() {
    return this.minimumMovementAngle;
  }
  public setMinimumMovementAngle(minimumMovementAngle: number) {
    this.minimumMovementAngle = p5Helper.default.round(minimumMovementAngle);
  }
  public getMaximumMovementAngle() {
    return this.maximumMovementAngle;
  }
  public setMaximumMovemetAngle(maximumMovementAngle: number) {
    this.maximumMovementAngle = p5Helper.default.round(maximumMovementAngle);
  }
  public getSideLineCoordinates() {
    return this.sideLineCoordinates;
  }
  public setSideLineCoordinates(sideLineCoordinates: Coordinate[]) {
    this.sideLineCoordinates = sideLineCoordinates;
  }
}
