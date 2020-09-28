import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PresetsComponent } from './presets.component';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { of } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('PresetsComponent', () => {
  let component: PresetsComponent;
  let fixture: ComponentFixture<PresetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PresetsComponent],
      imports: [],
      providers: [{ provide: DeviceDataManagerService, useValue: { sendToDevice: () => of('') } }],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
