import { TestBed } from '@angular/core/testing';

import { JsonSchemaValidatorService } from './json-schema-validator.service';

describe('JsonSchemaValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsonSchemaValidatorService = TestBed.get(JsonSchemaValidatorService);
    expect(service).toBeTruthy();
  });
});
