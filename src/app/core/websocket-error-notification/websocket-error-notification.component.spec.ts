import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketErrorNotificationComponent } from './websocket-error-notification.component';
import { ServiceAdapter } from '@providers/service-adapter';

describe('WebsocketErrorNotificationComponent', () => {
  let component: WebsocketErrorNotificationComponent;
  let fixture: ComponentFixture<WebsocketErrorNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WebsocketErrorNotificationComponent],
      providers: [
        { provide: ServiceAdapter, useValue: {
          getDeviceConnectionStatus: {
            next: () => {},
          },
        } },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsocketErrorNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
