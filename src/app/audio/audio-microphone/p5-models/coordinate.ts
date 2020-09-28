export class Coordinate {
  X: number;
  Y: number;
  constructor(x: number, y: number) {
    this.X = x;
    this.Y = y;
  }
  public getX(): number {
    return this.X;
  }
  public getY(): number {
    return this.Y;
  }
  public setX(x: number) {
    this.X = x;
  }
  public setY(y: number) {
    this.Y = y;
  }
}
