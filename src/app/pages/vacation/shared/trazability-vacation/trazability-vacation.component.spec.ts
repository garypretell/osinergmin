import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrazabilityVacationComponent } from './trazability-vacation.component';

describe('TrazabilityVacationComponent', () => {
  let component: TrazabilityVacationComponent;
  let fixture: ComponentFixture<TrazabilityVacationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrazabilityVacationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrazabilityVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
