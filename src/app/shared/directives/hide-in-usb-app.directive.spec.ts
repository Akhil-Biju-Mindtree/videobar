import { HideInUsbAppDirective } from './hide-in-usb-app.directive';
import { ViewChild, DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="text" appHideInUsbApp />`,
})
class TestComponent {
  @ViewChild(HideInUsbAppDirective, { static: false }) directive!: HideInUsbAppDirective;
}

describe('HideInUsbAppDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, HideInUsbAppDirective],
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
