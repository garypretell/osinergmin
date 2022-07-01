import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlinesVacationComponent } from './deadlines-vacation.component';

describe('DeadlinesVacationComponent', () => {
  let component: DeadlinesVacationComponent;
  let fixture: ComponentFixture<DeadlinesVacationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadlinesVacationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlinesVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
