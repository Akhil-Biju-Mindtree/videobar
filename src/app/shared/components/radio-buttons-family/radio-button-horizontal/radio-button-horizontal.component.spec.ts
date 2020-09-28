import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonHorizontalComponent } from './radio-button-horizontal.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('RadioButtonHorizontalComponent', () => {
  let component: RadioButtonHorizontalComponent;
  let fixture: ComponentFixture<RadioButtonHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RadioButtonHorizontalComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
