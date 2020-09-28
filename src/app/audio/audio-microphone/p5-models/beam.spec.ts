import { Beam } from './beam';

describe('Beam', () => {
  const angle = 0;

  it('should create an instance', () => {
    expect(new Beam(angle)).toBeTruthy();
  });
});
