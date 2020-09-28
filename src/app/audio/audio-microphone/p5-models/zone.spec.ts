import { Zone } from './zone';

describe('Zone', () => {
  const [startAngle, endAngle, enabledDragHandle] = [-90, -89, 'maximum'];
  it('should create an instance', () => {
    expect(new Zone(startAngle, endAngle, enabledDragHandle)).toBeTruthy();
  });
});
