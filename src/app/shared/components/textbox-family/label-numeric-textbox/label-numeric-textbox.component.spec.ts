import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelNumericTextboxComponent } from './label-numeric-textbox.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('LabelNumericTextboxComponent', () => {
  let component: LabelNumericTextboxComponent;
  let fixture: ComponentFixture<LabelNumericTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelNumericTextboxComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelNumericTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
