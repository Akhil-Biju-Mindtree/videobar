import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoFrameComponent } from './auto-frame.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AutoFrameComponent', () => {
  let component: AutoFrameComponent;
  let fixture: ComponentFixture<AutoFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoFrameComponent],
      providers: [{ provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of('') } }],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
