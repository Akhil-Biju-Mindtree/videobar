import { TestBed } from '@angular/core/testing';
import { WebFileService } from './web-file.service';

describe('WebFileService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        WebFileService,
      ],
    }),
  );

  it('should be created', () => {
    const service: WebFileService = TestBed.get(WebFileService);
    expect(service).toBeTruthy();
  });
});
