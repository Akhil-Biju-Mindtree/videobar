import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextviewComponent } from './textview.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TextviewComponent', () => {
  let component: TextviewComponent;
  let fixture: ComponentFixture<TextviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextviewComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
