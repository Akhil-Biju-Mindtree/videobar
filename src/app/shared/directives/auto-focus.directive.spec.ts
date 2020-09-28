import { AutoFocusDirective } from './auto-focus.directive';
import { TestBed, ComponentFixture, async, tick, fakeAsync } from '@angular/core/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="text" appAutoFocus />`,
})
class TestAutoFocusComponent {
  @ViewChild(AutoFocusDirective, { static: false }) directive!: AutoFocusDirective;
}

describe('AutoFocusDirective', () => {
  let testComponent: TestAutoFocusComponent;
  let fixture: ComponentFixture<TestAutoFocusComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAutoFocusComponent, AutoFocusDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(TestAutoFocusComponent);
    testComponent = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    spyOn(inputEl.nativeElement, 'focus');
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = testComponent.directive;
    expect(directive).toBeTruthy();
  });

  it('should call auto focus event on default input', fakeAsync(() => {
    tick(200);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(inputEl.nativeElement.focus()).toHaveBeenCalled();
    });
  }));
});
