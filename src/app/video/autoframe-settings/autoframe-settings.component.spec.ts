import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoframeSettingsComponent } from './autoframe-settings.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { of } from 'rxjs/internal/observable/of';
import { NotificationService } from '@shared/components/notification/notification.service';

describe('AutoframeSettingsComponent', () => {
  let component: AutoframeSettingsComponent;
  let fixture: ComponentFixture<AutoframeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoframeSettingsComponent],
      providers: [
        { provide: DeviceDataManagerService, useValue: { listenFromDevice: () => of(''), sendToDevice: () => of('') } },
        { provide: ConfirmationDialogService, useValue: {} },
        { provide: NotificationService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoframeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
