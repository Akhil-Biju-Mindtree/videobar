import { Triangle } from './p5-models/triangle';
import { Coordinate } from './p5-models/coordinate';
import { Beam } from './p5-models/beam';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';
import { AUDIO_CONSTANTS } from '../audio.constant';
class P5Helper {
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  mapInputRanges(input: number) {
    const inputRange = AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE;
    const outputRange = AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.OUTPUT_RANGE;
    return (
      outputRange[0] + ((outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0])) * (input - inputRange[0])
    );
  }

  mapOutputRange(input: number) {
    const inputRange = AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.OUTPUT_RANGE;
    const outputRange = AUDIO_CONSTANTS.BEAMS.RANGE_MAPPING.INPUT_RANGE;
    return (
      outputRange[0] + ((outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0])) * (input - inputRange[0])
    );
  }

  mapZoneInputRanges(input: number) {
    let returnValue: number;
    const inputRange = AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.INPUT_RANGE;
    const outputRange = AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_RANGE;
    if (input > inputRange[0] && input < inputRange[1]) {
      returnValue =
        outputRange[0] +
        ((outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0])) * (input - inputRange[0]);
    } else if (input >= inputRange[1] && input <= AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_DEVICE[1]) {
      const inputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.INPUT_RANGE[1],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_DEVICE[1],
      ];
      const outputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_RANGE[1],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_UI[1],
      ];
      returnValue =
        outputRangeExtended[0] +
        ((outputRangeExtended[1] - outputRangeExtended[0]) / (inputRangeExtended[1] - inputRangeExtended[0])) *
          (input - inputRangeExtended[0]);
    } else if (input <= inputRange[0] && input >= AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_DEVICE[0]) {
      const inputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.INPUT_RANGE[0],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_DEVICE[0],
      ];
      const outputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_RANGE[0],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_UI[0],
      ];
      returnValue =
        outputRangeExtended[0] +
        ((outputRangeExtended[1] - outputRangeExtended[0]) / (inputRangeExtended[1] - inputRangeExtended[0])) *
          (input - inputRangeExtended[0]);
    } else {
      returnValue = this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle;
    }
    return returnValue;
  }

  mapZoneOutputRange(input: number) {
    let returnValue: number;
    const inputRange = AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_RANGE;
    const outputRange = AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.INPUT_RANGE;
    if (input > inputRange[0] && input < inputRange[1]) {
      returnValue =
        outputRange[0] +
        ((outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0])) * (input - inputRange[0]);
    } else if (input >= inputRange[1] && input <= AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_UI[1]) {
      const inputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_RANGE[1],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_UI[1],
      ];
      const outputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.INPUT_RANGE[1],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_DEVICE[1],
      ];
      returnValue =
        outputRangeExtended[0] +
        ((outputRangeExtended[1] - outputRangeExtended[0]) / (inputRangeExtended[1] - inputRangeExtended[0])) *
          (input - inputRangeExtended[0]);
    } else if (input <= inputRange[0] && input >= AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_UI[0]) {
      const inputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_RANGE[0],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_UI[0],
      ];
      const outputRangeExtended = [
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.INPUT_RANGE[0],
        AUDIO_CONSTANTS.ZONES.RANGE_MAPPING.OUTPUT_EXTENDED_IN_DEVICE[0],
      ];
      returnValue =
        outputRangeExtended[0] +
        ((outputRangeExtended[1] - outputRangeExtended[0]) / (inputRangeExtended[1] - inputRangeExtended[0])) *
          (input - inputRangeExtended[0]);
    } else {
      returnValue = this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle;
    }
    return returnValue;
  }

  getAngleFromCoordinates(x: number, y: number) {
    const angleRad = Math.atan(y / x);
    const angleDeg = (angleRad * this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) / Math.PI;
    if (angleDeg < 0) {
      return angleDeg + this.microphoneConfigJson.beamComponent.beamConstrain.offset;
    }
    return angleDeg - this.microphoneConfigJson.beamComponent.beamConstrain.offset;
  }

  getAreaOfTriangle(triangle: Triangle) {
    return Math.abs(
      triangle.getTriangleCoordinates()[0].X *
        (triangle.getTriangleCoordinates()[1].Y - triangle.getTriangleCoordinates()[2].Y) +
        triangle.getTriangleCoordinates()[1].X *
          (triangle.getTriangleCoordinates()[2].Y - triangle.getTriangleCoordinates()[0].Y) +
        triangle.getTriangleCoordinates()[2].X *
          (triangle.getTriangleCoordinates()[0].Y - triangle.getTriangleCoordinates()[1].Y),
    );
  }

  isCoordinateInstdeTriangle(coordinate: Coordinate, beam: Beam): boolean {
    let retVal = false;
    const areaOfTriangle = this.getAreaOfTriangle(beam.getBeamCoordinates());
    let triangleCoordinates: Coordinate[] = [];
    // Area One
    triangleCoordinates.push(coordinate);
    triangleCoordinates.push(beam.getBeamCoordinates().getTriangleCoordinates()[1]);
    triangleCoordinates.push(beam.getBeamCoordinates().getTriangleCoordinates()[2]);
    const areaOne = this.getAreaOfTriangle(new Triangle(triangleCoordinates));
    // Area Two
    triangleCoordinates = []; // Emptying The Triangle Coordinate Array
    triangleCoordinates.push(beam.getBeamCoordinates().getTriangleCoordinates()[0]);
    triangleCoordinates.push(coordinate);
    triangleCoordinates.push(beam.getBeamCoordinates().getTriangleCoordinates()[2]);
    const areaTwo = this.getAreaOfTriangle(new Triangle(triangleCoordinates));
    // Area Three
    triangleCoordinates = []; // Emptying The Triangle Coordinate Array
    triangleCoordinates.push(beam.getBeamCoordinates().getTriangleCoordinates()[0]);
    triangleCoordinates.push(beam.getBeamCoordinates().getTriangleCoordinates()[1]);
    triangleCoordinates.push(coordinate);
    const areaThree = this.getAreaOfTriangle(new Triangle(triangleCoordinates));
    if (Math.round(areaOfTriangle) === Math.round(areaOne + areaTwo + areaThree)) {
      retVal = true;
    }
    return retVal;
  }

  calculateStaticBeamCoordinates(
    beam: Beam,
    beamWidth: number,
    radius: number,
    width: number,
    depth: number,
    canvasDimension: object,
  ) {
    const angle = 360 - beam.getAngle() + this.microphoneConfigJson.beamComponent.beamConstrain.offset;
    const offsetBeamZero =
      (angle - beamWidth / 2) * (Math.PI / this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
    const offsetBeamOne =
      (angle + beamWidth / 2) * (Math.PI / this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle);
    const newDepth = 21 + (35 - depth);
    const majorAxis = width >= 9 ? (radius * (9 + (width - 9) / 4.5)) / 9 : radius;
    const minorAxis =
      width >= 9 ? (radius * 1.33 * 14) / newDepth : (radius * 1.33 * 14 * ((5 + (width - 5) / 3) / 6.2)) / newDepth;
    const triangleCoordinates: Coordinate[] = [];
    triangleCoordinates.push(new Coordinate(canvasDimension['canvasWidth'] / 2, canvasDimension['canvasHeight']));
    triangleCoordinates.push(
      new Coordinate(
        canvasDimension['canvasWidth'] / 2 + majorAxis * Math.cos(offsetBeamZero),
        canvasDimension['canvasHeight'] - minorAxis * Math.sin(offsetBeamZero),
      ),
    );
    triangleCoordinates.push(
      new Coordinate(
        canvasDimension['canvasWidth'] / 2 + majorAxis * Math.cos(offsetBeamOne),
        canvasDimension['canvasHeight'] - minorAxis * Math.sin(offsetBeamOne),
      ),
    );
    beam.setBeamCoordinates(new Triangle(triangleCoordinates));
  }

  getDeltsXY(mouseX: number, mouseY: number, pMouseX: number, pMouseY: number) {
    const mouseDraggedAngle = this.getAngleFromCoordinates(
      mouseX - this.microphoneConfigJson.meetingRoomConfig.width / 2,
      mouseY - this.microphoneConfigJson.meetingRoomConfig.depth,
    );

    return mouseDraggedAngle < 0
      ? (mouseX - pMouseX - (mouseY - pMouseY)) / 2
      : (mouseX - pMouseX + (mouseY - pMouseY)) / 2;
  }

  isMouseWithInCanvas(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
    if (mouseX >= 0 && mouseY >= 0 && mouseX <= canvasWidth && mouseY <= canvasHeight) {
      /** the fraction used here is to determine the mouse pointer is not inside circular zone base
       * normally if canvas width is 440 the diameter will be of 48px so its in the proportion of 0.054545 times canvas width
       * if canvas height is 248 the cirle will be off center by 11px so its in the proportion of 0.044355 times canvas height
       * As beam screen is resizable any resolution we are handling related resizable with frators of canvas width and height
       */
      const dist = Math.sqrt(
        Math.abs(Math.pow(mouseX - canvasWidth / 2, 2) - Math.pow(mouseY - canvasHeight - 0.044355 * canvasHeight, 2)),
      );
      if (dist > 0.054545 * canvasWidth) {
        return true;
      }
    }
    return false;
  }

  round(floatNumber: number) {
    if (floatNumber - Math.round(floatNumber) === -0.5) {
      return Math.round(floatNumber) - 1;
    }
    return Math.round(floatNumber);
  }
}

const p5Helper = new P5Helper();
export default p5Helper;
