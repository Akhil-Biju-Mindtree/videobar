import { TestBed } from '@angular/core/testing';

import { VideoCanDeactivateGuardService } from './video-candeactivate-guard.service';

describe('VideoCandeactivateGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoCanDeactivateGuardService = TestBed.get(VideoCanDeactivateGuardService);
    expect(service).toBeTruthy();
  });
});
