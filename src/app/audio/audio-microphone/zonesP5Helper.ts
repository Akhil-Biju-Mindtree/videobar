import { Coordinate } from './p5-models/coordinate';
import { Zone } from './p5-models/zone';
import { Triangle } from './p5-models/triangle';
import * as microphoneConfigJsonMap from '@assets/json/microphone-config.json';

class ZonesP5Helper {
  microphoneConfigJson = microphoneConfigJsonMap['default'];
  getMidPoint(coordinateOne: Coordinate, coordinateTwo: Coordinate) {
    const X1 = coordinateOne.X;
    const Y1 = coordinateOne.Y;
    const X2 = coordinateTwo.X;
    const Y2 = coordinateTwo.Y;
    return new Coordinate((X1 + X2) / 2, (Y1 + Y2) / 2);
  }

  getAngleFromCoordinates(x: number, y: number) {
    const angleRad = Math.atan(y / x);
    const angleDeg = (angleRad * this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle) / Math.PI;
    if (angleDeg < 0) {
      return angleDeg + this.microphoneConfigJson.beamComponent.beamConstrain.offset;
    }
    return angleDeg - this.microphoneConfigJson.beamComponent.beamConstrain.offset;
  }

  isMouseWithInCanvas(mouseX: number, mouseY: number, width: number, height: number) {
    if (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
      return true;
    }
    return false;
  }

  getDistanceBetweenTwoPoints(coordinateOne: Coordinate, coordinateTwo: Coordinate) {
    const X1 = coordinateOne.X;
    const Y1 = coordinateOne.Y;
    const X2 = coordinateTwo.X;
    const Y2 = coordinateTwo.Y;
    return Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2));
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
  isCoordinateInstdeTriangle(coordinate: Coordinate, zone: Zone, a: number, b: number): boolean {
    let retVal = false;
    const areaOfTriangle = this.getAreaOfTriangle(zone.getZoneCoordinates());
    let triangleCoordinates: Coordinate[] = [];
    // Area One
    triangleCoordinates.push(coordinate);
    triangleCoordinates.push(zone.getZoneCoordinates().getTriangleCoordinates()[1]);
    triangleCoordinates.push(zone.getZoneCoordinates().getTriangleCoordinates()[2]);
    const areaOne = this.getAreaOfTriangle(new Triangle(triangleCoordinates));
    // Area Two
    triangleCoordinates = []; // Emptying The Triangle Coordinate Array
    triangleCoordinates.push(zone.getZoneCoordinates().getTriangleCoordinates()[0]);
    triangleCoordinates.push(coordinate);
    triangleCoordinates.push(zone.getZoneCoordinates().getTriangleCoordinates()[2]);
    const areaTwo = this.getAreaOfTriangle(new Triangle(triangleCoordinates));
    // Area Three
    triangleCoordinates = []; // Emptying The Triangle Coordinate Array
    triangleCoordinates.push(zone.getZoneCoordinates().getTriangleCoordinates()[0]);
    triangleCoordinates.push(zone.getZoneCoordinates().getTriangleCoordinates()[1]);
    triangleCoordinates.push(coordinate);
    const areaThree = this.getAreaOfTriangle(new Triangle(triangleCoordinates));

    const endAngle =
      zone.getEndAngle() < 0 &&
      zone.getEndAngle() >= this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle
        ? this.microphoneConfigJson.beamComponent.beamConstrain.offset - zone.getEndAngle()
        : zone.getEndAngle() >= 0 &&
          zone.getEndAngle() <= this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle
        ? this.microphoneConfigJson.beamComponent.beamConstrain.offset + zone.getEndAngle()
        : zone.getEndAngle();

    const startAngle =
      zone.getStartAngle() < 0 &&
      zone.getStartAngle() >= this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMinimumAngle
        ? this.microphoneConfigJson.beamComponent.beamConstrain.offset - zone.getStartAngle()
        : zone.getStartAngle() >= 0 &&
          zone.getStartAngle() <= this.microphoneConfigJson.zoneComponent.zoneConstraints.zoneMaximumAngle
        ? this.microphoneConfigJson.beamComponent.beamConstrain.offset + zone.getStartAngle()
        : zone.getStartAngle();

    const areaOfSector =
      (a *
        b *
        ((endAngle * Math.PI) / this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle -
          (startAngle * Math.PI) / this.microphoneConfigJson.beamComponent.beamConstrain.beamDeleteAngle)) /
      2;

    const newX =
      coordinate.getX() -
      zone
        .getZoneCoordinates()
        .getTriangleCoordinates()[0]
        .getX();
    const newY =
      coordinate.getY() -
      zone
        .getZoneCoordinates()
        .getTriangleCoordinates()[0]
        .getY();
    const rMouse = Math.sqrt(Math.pow(newX, 2) + Math.pow(newY, 2) / Math.pow(b / a, 2));

    if (Math.round(areaOfTriangle) === Math.round(areaOne + areaTwo + areaThree)) {
      retVal = true;
    } else if (
      Math.round(areaOfTriangle + areaOfSector) === Math.round(areaThree + areaTwo + areaOfSector - areaOne) &&
      rMouse < a
    ) {
      retVal = true;
    }
    return retVal;
  }
}

const zonesP5Helper = new ZonesP5Helper();
export default zonesP5Helper;
