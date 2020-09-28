import { ChangeBgColorDirective } from './change-bg-color.directive';
import { ViewChild, DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appChangeBgColor></div>`,
})
class TestComponent {
  @ViewChild(ChangeBgColorDirective, { static: false }) directive!: ChangeBgColorDirective;
}

describe('ChangeBgColorDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ChangeBgColorDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('div'));
  });
  it('should create an instance', () => {
    const directive = testComponent.directive;
    expect(directive).toBeTruthy();
  });
});
