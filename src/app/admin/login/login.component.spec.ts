import { ComponentFixture, TestBed } from '@angular/core/testing';
import '../../../mocks/matchMedia.mock';

import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';

import { DeviceDataManagerService } from '@core/services/device-data-manager.service';
import { DeviceDataManagerServiceMock } from '../../../mocks/device-data-manager.service.mock';
import { AuthService } from '@core/auth/auth.service';
import { AuthServiceMock } from '../../../mocks/auth.service.mock';
import { ApplicationDataManagerServiceMock } from '../../../mocks/application-data-manager.service.mock';
import { ApplicationDataManagerService } from '@core/services/app-data-manager.service';

import { RouterTestingModule } from '@angular/router/testing';
import { FormGroup, FormControl } from '@angular/forms';

describe('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: DeviceDataManagerService,
          useClass: DeviceDataManagerServiceMock,
        },
        {
          provide: AuthService,
          useValue: AuthServiceMock,
        },
        {
          provide: ApplicationDataManagerService,
          useClass: ApplicationDataManagerServiceMock,
        },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updatePassword:', () => {
    component.updatePassword('Bose123!');
    expect(component.currentPassword).toBe('BC8B1628901369D49AA4CEF8E687AF58');
  });

  it('routeAfterAuthenticate: Redirect to firmware', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.redirectToFirware = true;
    component.routeAfterAuthenticate();

    expect(navigateSpy).toHaveBeenCalledWith('/configuration/firmware');
  });

  it('routeAfterAuthenticate: Redirect to status', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.redirectToFirware = false;
    component.routeAfterAuthenticate();

    expect(navigateSpy).toHaveBeenCalledWith('/status');
  });

  it('onCancel:', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onCancel();

    expect(navigateSpy).toHaveBeenCalledWith('/camera');
  });

  it('should call isInvalid:', () => {
    component.loginForm = new FormGroup({ '41d8625a-7ebb-4a44-87df-41524b446dcb': new FormControl() });
    component.loginForm.markAsTouched();
    component.loginForm.markAsDirty();
    const responseData = component.isInvalid();
    expect(responseData).toEqual(false);
  });

  it('should call onCheckShowPassword:', () => {
    component.loginForm = new FormGroup({ '41d8625a-7ebb-4a44-87df-41524b446dcb': new FormControl() });
    component.onCheckShowPassword();
    expect(component.isPasswordShown).toEqual(true);
  });

  it('should call login:', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.redirectToFirware = false;
    component.login();
    expect(navigateSpy).toHaveBeenCalledWith('/status');
  });

  it('should call login:', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.redirectToFirware = false;
    component.logout();
    expect(navigateSpy).toHaveBeenCalledWith('/camera');
  });
});
