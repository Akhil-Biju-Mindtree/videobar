import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LowLightCompensationComponent } from './low-light-compensation.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LowLightCompensationComponent', () => {
  let component: LowLightCompensationComponent;
  let fixture: ComponentFixture<LowLightCompensationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LowLightCompensationComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowLightCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
