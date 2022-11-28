import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaService } from '@shared/services/bandeja.service';
import { IEmpleadosReemplazo } from '@shared/models/common/interfaces/bandeja.interface';
import { Observable, Subject } from 'rxjs';
import { VacationService } from '@pages/vacation/vacation.service';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { Router } from '@angular/router';
import { BaseFormPeriod } from '@shared/utils/base-form-period';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-period-add',
  templateUrl: './period-add.component.html',
  styleUrls: ['./period-add.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PeriodAddComponent implements OnInit, OnDestroy {
  dateInit = new FormControl(moment());
  dateEnd = new FormControl(moment().add(1, 'years'));
  ocultar = false;
  usuario: any;
  tipoLista: any[] = [];
  actionTODO = Action.NEW;
  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;
  reemplazoValue: any;
  private unsubscribe$ = new Subject();
  isLoading = false;
  constructor(
    private bandejaService: BandejaService,
    private vacationService: VacationService,
    private router: Router,
    public dialogRef: MatDialogRef<PeriodAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public periodForm: BaseFormPeriod,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const descPeriodo = `${this.dateInit.value.year()}-${this.dateEnd.value.year()}`;
    if (this.data?.period.hasOwnProperty('codPeriodo')) {
      this.actionTODO = Action.EDIT;
      this.ocultar = true;
      this.periodForm.baseForm.updateValueAndValidity();
      this.pathFormData();
    } else {
      if (this.data?.nuevo) {
        this.periodForm.baseForm.reset();
        this.periodForm?.baseForm?.get('descPeriodo')?.setValue(descPeriodo);
        this.periodForm?.baseForm?.get('descPeriodo')?.disable();
      }
    }
  }

  validateData(): any {
    return this.dateInit.value.isBefore(this.dateEnd.value) ? true : false;
  }

  onSave(): void {
    if (!this.data?.period?.hasOwnProperty('codPeriodo')) {
      this.agregar();
    } else {
      this.editar();
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  private pathFormData(): void {
    this.periodForm.baseForm.patchValue({
      descPeriodo: this.data?.period?.descPeriodo
    });
    const arrDesc = this.data?.period?.descPeriodo.split('-')
    this.dateInit = new FormControl(moment().set('year', arrDesc[0]));
    this.dateEnd = new FormControl(moment().set('year', arrDesc[1]));
    this.periodForm?.baseForm?.get('descPeriodo')?.disable();
  }

  agregar(): any {
    const formValue = this.periodForm.baseForm.getRawValue();
    const period: any = {};
    period.descPeriodo = formValue.descPeriodo;
    this.data.period = period;
  }

  editar(): any {
    const formValue = this.periodForm.baseForm.getRawValue();
    const periodId = this.data?.period?.codPeriodo;
    const period: any = {};
    period.codPeriodo = periodId;
    period.descPeriodo = formValue.descPeriodo;
    this.data.period = period;
  }

  goBandeja(): void {
    this.dialogRef.close();
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateInit.value;
    ctrlValue.year(normalizedYear.year());
    this.dateInit.setValue(ctrlValue);
    const descPeriodo = `${this.dateInit.value.year()}-${this.dateEnd.value.year()}`;
    this.periodForm.baseForm.patchValue({
      descPeriodo: descPeriodo
    });
    // this.periodForm.baseForm.get('descPeriodo')?.setValue(descPeriodo);
    datepicker.close();
  }

  chosenYearHandlerEnd(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.dateEnd.value;
    ctrlValue.year(normalizedYear.year());
    this.dateEnd.setValue(ctrlValue);
    const descPeriodo = `${this.dateInit.value.year()}-${this.dateEnd.value.year()}`;
    this.periodForm.baseForm.patchValue({
      descPeriodo: descPeriodo
    });
    // this.periodForm.baseForm.get('descPeriodo')?.setValue(descPeriodo);
    datepicker.close();
  }

}
