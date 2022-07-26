import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPendingComponent } from './request-pending.component';

describe('RequestPendingComponent', () => {
  let component: RequestPendingComponent;
  let fixture: ComponentFixture<RequestPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
