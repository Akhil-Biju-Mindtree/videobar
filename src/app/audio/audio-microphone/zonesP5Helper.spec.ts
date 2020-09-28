import * as zonesP5Helper from './zonesP5Helper';
import { Coordinate } from './p5-models/coordinate';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { Triangle } from './p5-models/triangle';
import { Zone } from './p5-models/zone';

describe('ZoneP5Helper', () => {
  let microphoneConfigJson;
  let zone: Zone;
  let majorAxis;
  let minorAxis;
  const triangleCoordinates = [];

  beforeAll(() => {
    microphoneConfigJson = microphoneConfigJsonMap['default'];
    majorAxis = microphoneConfigJson.canvasConstrain.width / 2;
    minorAxis = majorAxis / 1.33;
    zone = new Zone(38, 56, 'both');
    const zoneMinimumAngle =
      (360 - zone.getStartAngle() + microphoneConfigJson.beamComponent.beamConstrain.offset) *
      (Math.PI / microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
    const zoneMaximumAngle =
      (360 - zone.getEndAngle() + microphoneConfigJson.beamComponent.beamConstrain.offset) *
      (Math.PI / microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
    zone.setMinimumMovementAngle(25);
    zone.setMaximumMovemetAngle(65);
    triangleCoordinates.push(
      new Coordinate(microphoneConfigJson.canvasConstrain.width / 2, microphoneConfigJson.canvasConstrain.height),
    );
    triangleCoordinates.push(
      new Coordinate(
        microphoneConfigJson.canvasConstrain.width / 2 + majorAxis * Math.cos(zoneMinimumAngle),
        microphoneConfigJson.canvasConstrain.height - minorAxis * Math.sin(zoneMinimumAngle),
      ),
    );
    triangleCoordinates.push(
      new Coordinate(
        microphoneConfigJson.canvasConstrain.width / 2 + majorAxis * Math.cos(zoneMaximumAngle),
        microphoneConfigJson.canvasConstrain.height - minorAxis * Math.sin(zoneMaximumAngle),
      ),
    );
    zone.setZoneCoordinates(new Triangle(triangleCoordinates));
  });

  it('getMidPoint method should return minpoint coordinates', () => {
    const coordinateOne = new Coordinate(2, 4);
    const coordinateTwo = new Coordinate(6, 8);
    const expectedResult = new Coordinate(4, 6);
    const result = zonesP5Helper.default.getMidPoint(coordinateOne, coordinateTwo);
    expect(result).toEqual(expectedResult);
  });

  it('getAngleFromCoordinates method should return negative angle for Q1 coordiantes', () => {
    const x = 30;
    const y = 30;
    const result = zonesP5Helper.default.getAngleFromCoordinates(x, y);
    const expectedResult = -45;
    expect(result).toEqual(expectedResult);
  });

  it('getAngleFromCoordinates method should return positive angle for Q2 coordiantes', () => {
    const x = -33;
    const y = 33;
    const result = zonesP5Helper.default.getAngleFromCoordinates(x, y);
    const expectedResult = 45;
    expect(result).toEqual(expectedResult);
  });

  it('isMouseWithInCanvas method should return true if mouse is inside canvas area', () => {
    const [mouseX, mouseY] = [100, 53];
    const [canvasWidth, canvasHeight] = [
      microphoneConfigJson.canvasConstrain.width,
      microphoneConfigJson.canvasConstrain.height,
    ];
    const result = zonesP5Helper.default.isMouseWithInCanvas(mouseX, mouseY, canvasWidth, canvasHeight);
    expect(result).toBeTruthy();
  });

  it('isMouseWithInCanvas method should return false if mouse is outside canvas area', () => {
    const [mouseX, mouseY] = [40, 523];
    const [canvasWidth, canvasHeight] = [
      microphoneConfigJson.canvasConstrain.fullScreenWidth,
      microphoneConfigJson.canvasConstrain.fullScreenHeight,
    ];
    const result = zonesP5Helper.default.isMouseWithInCanvas(mouseX, mouseY, canvasWidth, canvasHeight);
    expect(result).toBeFalsy();
  });

  it('getDistanceBetweenTwoPoints method should return distance between two coordinates', () => {
    const coordinateOne = new Coordinate(20, 30);
    const coordinateTwo = new Coordinate(-30, 40);
    const result = zonesP5Helper.default.getDistanceBetweenTwoPoints(coordinateOne, coordinateTwo);
    const expectedResult = 50.990195;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('getAreaOfTriangle method should return area of triangle', () => {
    const triangle = new Triangle(triangleCoordinates);
    const result = zonesP5Helper.default.getAreaOfTriangle(triangle);
    const expectedResult = 11245.4304719;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('isCoordinateInstdeTriangle method should return true on mouse coordiante is inside Zone area', () => {
    const mouseCoordiantes = new Coordinate(340, 150);
    const result = zonesP5Helper.default.isCoordinateInstdeTriangle(mouseCoordiantes, zone, majorAxis, minorAxis);
    expect(result).toBeTruthy();
  });

  it('isCoordinateInstdeTriangle method should return false on mouse coordiante is ouside Zone trangle area', () => {
    const mouseCoordiantes = new Coordinate(30, 50);
    zone.setStartAngle(-50);
    zone.setEndAngle(-20);
    const result = zonesP5Helper.default.isCoordinateInstdeTriangle(mouseCoordiantes, zone, majorAxis, minorAxis);
    expect(result).toBeFalsy();
  });

});
