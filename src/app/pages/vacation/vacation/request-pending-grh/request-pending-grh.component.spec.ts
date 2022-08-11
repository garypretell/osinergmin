import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPendingGrhComponent } from './request-pending-grh.component';

describe('RequestPendingGrhComponent', () => {
  let component: RequestPendingGrhComponent;
  let fixture: ComponentFixture<RequestPendingGrhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPendingGrhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPendingGrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
