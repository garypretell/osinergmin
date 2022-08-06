import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPendingDetailComponent } from './request-pending-detail.component';

describe('RequestPendingDetailComponent', () => {
  let component: RequestPendingDetailComponent;
  let fixture: ComponentFixture<RequestPendingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPendingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPendingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
