import { Coordinate } from './coordinate';

describe('Coordinate', () => {
  const [coordinateX, coordinateY] = [0, 0];

  it('should create an instance', () => {
    expect(new Coordinate(coordinateX, coordinateY)).toBeTruthy();
  });
});
