import { ButtonHighlighterDirective } from './button-highlighter.directive';
import { ViewChild, DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<button appButtonHighlighter>test</button>`,
})
class TestComponent {
  @ViewChild(ButtonHighlighterDirective, { static: false }) directive!: ButtonHighlighterDirective;
}

describe('ButtonHighlighterDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ButtonHighlighterDirective],
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
