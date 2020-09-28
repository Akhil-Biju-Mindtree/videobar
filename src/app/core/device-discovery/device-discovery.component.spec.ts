import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDiscoveryComponent } from './device-discovery.component';
import { SharedModule } from '@shared/shared.module';
import { of } from 'rxjs';

describe('DeviceDiscoveryComponent', () => {
  let component: DeviceDiscoveryComponent;
  let fixture: ComponentFixture<DeviceDiscoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceDiscoveryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(DeviceDiscoveryComponent).toBeTruthy();
  });
});
