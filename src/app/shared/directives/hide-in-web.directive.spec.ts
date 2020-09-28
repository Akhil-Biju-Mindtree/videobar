import { HideInWebDirective } from './hide-in-web.directive';
import { DebugElement, Renderer2, Component, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="text" appHideInWeb />`,
})
class TestComponent {
  @ViewChild(HideInWebDirective, { static: false }) directive!: HideInWebDirective;
}

describe('HideInWebUIDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, HideInWebDirective],
      providers: [Renderer2],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('input'));
  });

  it('should create an instance', () => {
    const directive = testComponent.directive;
    expect(directive).toBeTruthy();
  });

});
