import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFieldTextboxComponent } from './text-field-textbox.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TextFieldTextboxComponent', () => {
  let component: TextFieldTextboxComponent;
  let fixture: ComponentFixture<TextFieldTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextFieldTextboxComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFieldTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
