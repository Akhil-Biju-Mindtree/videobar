import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SilderWithTextboxComponent } from './silder-with-textbox.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SilderWithTextboxComponent', () => {
  let component: SilderWithTextboxComponent;
  let fixture: ComponentFixture<SilderWithTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SilderWithTextboxComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SilderWithTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
