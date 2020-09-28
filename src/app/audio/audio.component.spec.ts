import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AudioComponent } from './audio.component';
import { of } from 'rxjs/internal/observable/of';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

describe('AudioComponent', () => {
  let component: AudioComponent;
  let fixture: ComponentFixture<AudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioComponent],
      imports: [],
      providers: [
        { provide: ApplicationDataManagerService, useValue: { listenForAppData: () => of('') } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
