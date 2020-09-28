import { Coordinate } from './coordinate';

export class Triangle {
  triangleCoordinates: Coordinate[];

  constructor(coordinates: Coordinate[]) {
    this.triangleCoordinates = coordinates;
  }
  public getTriangleCoordinates(): Coordinate[] {
    return this.triangleCoordinates;
  }
  public setTriangleCoordinates(coordinates: Coordinate[]) {
    this.triangleCoordinates = coordinates;
  }
}
