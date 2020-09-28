import * as beamsP5Helper from './beamsP5Helper';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { Coordinate } from './p5-models/coordinate';
import { Triangle } from './p5-models/triangle';
import { Beam } from './p5-models/beam';

describe('BeamP5Helper', () => {
  let microphoneConfigJson;
  let beam: Beam;
  let majorAxis;
  let minorAxis;
  const triangleCoordinates = [];

  beforeAll(() => {
    microphoneConfigJson = microphoneConfigJsonMap['default'];
    majorAxis = microphoneConfigJson.canvasConstrain.width / 2;
    minorAxis = majorAxis / 1.33;
    beam = new Beam(7);
  });

  it('mapInputRanges method should return converted beam angle [-50, 50] => [-60, 60]', () => {
    const input = 25;
    const result = beamsP5Helper.default.mapInputRanges(input);
    const expectedResult = 26.7857142;
    expect(result).toBeCloseTo(expectedResult, 5);
  });
  it('mapInputRanges method should return converted beam angle [-60, 60] => [-50, 50]', () => {
    const input = -37;
    const result = beamsP5Helper.default.mapOutputRange(input);
    const expectedResult = -34.53333333;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneInputRanges method should return converted zone angle [-50, 50] => [-60, -60]', () => {
    const input = 37;
    const result = beamsP5Helper.default.mapZoneInputRanges(input);
    const expectedResult = 39.642857;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneInputRanges method should return converted zone angle [-89, -50] => [-89, -60]', () => {
    const negativeInput = -73;
    const result = beamsP5Helper.default.mapZoneInputRanges(negativeInput);
    const expectedResult = -71.84848484;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneInputRanges method should return converted zone angle [89, 50] => [89, 60]', () => {
    const positiveInput = 73;
    const result = beamsP5Helper.default.mapZoneInputRanges(positiveInput);
    const expectedResult = 71.84848484;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneInputRanges method should return 180 for out of rangle', () => {
    const input = -156;
    const result = beamsP5Helper.default.mapZoneInputRanges(input);
    const expectedResult = 180;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneOutputRange method should return converted zone angle [-60, 60] => [-50, 50]', () => {
    const input = 28;
    const result = beamsP5Helper.default.mapZoneOutputRange(input);
    const expectedResult = 26.133333;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneOutputRange method should return converted zone angle [-89, -60] => [-89, -50]', () => {
    const input = -68;
    const result = beamsP5Helper.default.mapZoneOutputRange(input);
    const expectedResult = -67.47826086;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneOutputRange method should return converted zone angle [89, 60] => [89, 50]', () => {
    const positiveInput = 68;
    const result = beamsP5Helper.default.mapZoneOutputRange(positiveInput);
    const expectedResult = 67.47826086;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('mapZoneOutputRange method should return 180 for out of rangle', () => {
    const deletedInputAngle = 180;
    const result = beamsP5Helper.default.mapZoneOutputRange(deletedInputAngle);
    const expectedResult = 180;
    expect(result).toBeCloseTo(expectedResult, 5);
  });

  it('getAngleFromCoordinates method should return negative angle for Q1 coordiantes', () => {
    const x = 30;
    const y = 30;
    const result = beamsP5Helper.default.getAngleFromCoordinates(x, y);
    const expectedResult = -45;
    expect(result).toEqual(expectedResult);
  });

  it('getAngleFromCoordinates method should return positive angle for Q2 coordiantes', () => {
    const x = -33;
    const y = 33;
    const result = beamsP5Helper.default.getAngleFromCoordinates(x, y);
    const expectedResult = 45;
    expect(result).toEqual(expectedResult);
  });

});
