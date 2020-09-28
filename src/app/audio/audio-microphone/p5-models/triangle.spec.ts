import { Triangle } from './triangle';
import { Coordinate } from './coordinate';

describe('Triangle', () => {
  const triangleCoordinates: Coordinate[] = [new Coordinate(0, 0), new Coordinate(0, 1), new Coordinate(1, 0)];

  it('should create an instance', () => {
    expect(new Triangle(triangleCoordinates)).toBeTruthy();
  });
});
