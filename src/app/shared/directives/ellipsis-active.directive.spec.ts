import { EllipsisActiveDirective } from './ellipsis-active.directive';
import { ViewChild, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<span isEllipsisActive>abcd</span>`,
})
class TestComponent {
  @ViewChild(EllipsisActiveDirective, { static: false }) directive!: EllipsisActiveDirective;
}

describe('EllipsisActiveDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, EllipsisActiveDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('span'));
  });

  it('should create an instance', () => {
    const directive = testComponent.directive;
    expect(directive).toBeTruthy();
  });
});
