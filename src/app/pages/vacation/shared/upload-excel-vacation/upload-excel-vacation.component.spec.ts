import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadExcelVacationComponent } from './upload-excel-vacation.component';

describe('UploadExcelVacationComponent', () => {
  let component: UploadExcelVacationComponent;
  let fixture: ComponentFixture<UploadExcelVacationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadExcelVacationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadExcelVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
