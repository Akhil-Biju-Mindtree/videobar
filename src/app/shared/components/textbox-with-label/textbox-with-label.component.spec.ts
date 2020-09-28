import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxWithLabelComponent } from './textbox-with-label.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TextboxWithLabelComponent', () => {
  let component: TextboxWithLabelComponent;
  let fixture: ComponentFixture<TextboxWithLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextboxWithLabelComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextboxWithLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
