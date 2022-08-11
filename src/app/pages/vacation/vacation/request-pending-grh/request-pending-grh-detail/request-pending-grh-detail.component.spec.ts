import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPendingGrhDetailComponent } from './request-pending-grh-detail.component';

describe('RequestPendingGrhDetailComponent', () => {
  let component: RequestPendingGrhDetailComponent;
  let fixture: ComponentFixture<RequestPendingGrhDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPendingGrhDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPendingGrhDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
