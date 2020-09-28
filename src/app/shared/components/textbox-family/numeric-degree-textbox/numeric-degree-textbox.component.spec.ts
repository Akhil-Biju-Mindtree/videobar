import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericDegreeTextboxComponent } from './numeric-degree-textbox.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('NumericDegreeTextboxComponent', () => {
  let component: NumericDegreeTextboxComponent;
  let fixture: ComponentFixture<NumericDegreeTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumericDegreeTextboxComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericDegreeTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
