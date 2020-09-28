import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonVerticalComponent } from './radio-button-vertical.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RadioButtonVerticalComponent', () => {
  let component: RadioButtonVerticalComponent;
  let fixture: ComponentFixture<RadioButtonVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RadioButtonVerticalComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
