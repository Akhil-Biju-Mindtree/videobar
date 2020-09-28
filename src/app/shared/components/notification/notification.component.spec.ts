import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { MaterialModule } from '../../modules/material.module';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Renderer2, ElementRef, Component, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div class="cdk-overlay-pane"><app-notification></app-notification></div>`,
})
class TestAutoFocusComponent {
  @ViewChild(NotificationComponent, { static: false }) notification;
}

describe('NotificationComponent', () => {
  let component: TestAutoFocusComponent;
  let fixture: ComponentFixture<TestAutoFocusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestAutoFocusComponent, NotificationComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: MatSnackBarRef },
        { provide: MAT_SNACK_BAR_DATA, useValue: MAT_SNACK_BAR_DATA },
        { provide: Renderer2, useValue: { listen: () => of('') } },
        { provide: Router, useValue: { events: of('') } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAutoFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should onClose', () => {
    expect(component).toBeTruthy();
  });
});
