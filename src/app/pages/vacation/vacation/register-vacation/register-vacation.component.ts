import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { IDatosRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo, IRegistroVacaionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { BaseFormVacation } from '@shared/utils/base-form-vacation';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, startWith, debounceTime, tap, finalize, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-vacation',
  templateUrl: './register-vacation.component.html',
  styleUrls: ['./register-vacation.component.scss']
})
export class RegisterVacationComponent implements OnInit, OnDestroy {
  @ViewChild('formReg') public formReg!: NgForm;
  today = new Date();
  fechaInicio = new Date();
  fechaFin = new Date();
  vacaciones: any = {};
  usuario: any = {};
  registro: IDatosRegistroResponse = {} as IDatosRegistroResponse;
  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;

  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [];
  aprobadoCtrl = new FormControl('');
  aprobadoValue: any;
  filteredAprobado!: Observable<IEmpleadoAprobacion[]> | undefined;
  steps = 0.5;
  hasDot = false;
  isLoading = false;
  fechaFinState = false;
  diasState = false;
  private unsubscribe$ = new Subject();
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService,
    private datePipe: DatePipe, public dialog: MatDialog, public vacationForm: BaseFormVacation) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  private _filterStatesReemplazo(value: any): IEmpleadosReemplazo[] {
    const filterValue = value.nombres ? value.nombres.toLowerCase() : value.toLowerCase();

    return this.listaEmpleadosReemplazo.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  private _filterStatesAprobado(value: any): IEmpleadoAprobacion[] {
    const filterValue = value.nombres ? value.nombres.toLowerCase() : value.toLowerCase();

    return this.listaEmpleadoAprobacion.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    const user: any = this.vacationService.userValue;
    user && user.identificacion ? this.usuario = user : this.goBandeja();
    this.vacationForm.baseForm.reset();
    if (user?.identificacion) {
      this.vacationForm.baseForm.get('maxDias')?.setValue(user.saldo);
      const dialogRef = this.dialog.open(LoaderComponent, {
        width: '400px', data: {}, disableClose: true
      });
      this.bandejaService.getDatosRegistros({
        identificacion: this.usuario.identificacion,
        nombres: this.usuario.nombres
      }).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (data: IDatosRegistroResponse) => {
          this.registro = data;
          this.vacationForm.baseForm.updateValueAndValidity();
          this.pathFormData();
          this.listaEmpleadosReemplazo = data.listaEmpleadosReemplazo;
          this.listaEmpleadoAprobacion = data.listaEmpleadoAprobacion;
          this.vacationForm.baseForm.get('codEmplAprobacion')?.setValue(this.listaEmpleadoAprobacion[0]);
          this.vacationForm.baseForm.get('codEmplReemplazo')?.setValue('');
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
        },
        complete: () => {
          this.filteredReemplazo = this.vacationForm.baseForm.get('codEmplReemplazo')?.valueChanges.pipe(
            tap(() => this.isLoading = true),
            debounceTime(300),
            startWith(''),
            map(state => {
              this.isLoading = false;
              return state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice();
            })

          );
          this.filteredAprobado = this.vacationForm.baseForm.get('codEmplAprobacion')?.valueChanges.pipe(
            tap(() => this.isLoading = true),
            debounceTime(300),
            startWith(''),
            map(state => (state ? this._filterStatesAprobado(state) : this.listaEmpleadoAprobacion.slice())),
            finalize(() => this.isLoading = false)
          );
        }
      });
    }
    this.calcularDias();
    this.vacationForm.baseForm.get('dias')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(change => {
      if (change && !this.fechaFinState) {
        this.hasDot = change.toString().includes('.');
        const result = new Date(this.vacationForm.baseForm.get('fechaInicio')?.value);
        result.setDate(result.getDate() + Math.round(+change) - 1);
        this.diasState = true;
        this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
        this.diasState = false;
      }
    })
    this.vacationForm.baseForm.get('fechaInicio')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(change => {
      if (change) {
        const fecha1 = moment(change);
        const fecha2 = moment(this.vacationForm.baseForm.get('fechaFin')?.value);
        const temp = fecha2.diff(fecha1, 'days') + 1;
        this.fechaFinState = true;
        this.vacationForm.baseForm.get('dias')?.setValue(temp);
        this.fechaFinState = false;
      }
    })
    this.vacationForm.baseForm.get('fechaFin')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(change => {
      if (change && !this.diasState) {
        const fecha2 = moment(change);
        const fecha1 = moment(this.vacationForm.baseForm.get('fechaInicio')?.value);
        const temp = fecha2.diff(fecha1, 'days') + 2;
        this.fechaFinState = true;
        this.vacationForm.baseForm.get('dias')?.setValue(temp);
        this.fechaFinState = false;
      }
    })

  }

  private pathFormData(): void {
    this.vacationForm.baseForm.patchValue({
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro: this.registro.codRegistro,
      codigoSolicitud: this.registro.codigoSolicitud,
      diaMedio: '1',
      maxDias: this.usuario.saldo
    });
  }

  goBandeja(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
  }

  calcularDias(): any {
    this.vacationForm.baseForm.get('fechaInicio')?.setValue(new Date(this.fechaInicio));
    const result = new Date(this.fechaInicio);
    result.setDate(result.getDate() + this.vacationForm.baseForm.get('dias')?.value);
    this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
    this.fechaFin = result;
  }

  registrar(): void {
    const body: IRegistroVacaionalBody = {
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro: this.registro.codRegistro,
      codigoSolicitud: this.registro.codigoSolicitud,
      diaMedio: this.vacationForm.baseForm.get('dias')?.value.toString().includes('.') ? '1' : '0',
      fechaInicio: this.datePipe.transform(this.vacationForm.baseForm.get('fechaInicio')?.value, 'dd/MM/yyyy')?.toString() || '',
      fechaFin: this.datePipe.transform(this.vacationForm.baseForm.get('fechaFin')?.value, 'dd/MM/yyyy')?.toString() || '',
      dias: this.vacationForm.baseForm.get('dias')?.value.toString(),
      codEmplReemplazo: this.vacationForm.baseForm.get('codEmplReemplazo')?.value.identificacion,
      codEmplAprobacion: this.vacationForm.baseForm.get('codEmplAprobacion')?.value.identificacion
    }
    this.bandejaService.postRegistro(body).subscribe({
      next: (data: IDatosRegistroResponse) => {
        Swal.fire(
          `Solicitud : ${this.registro.codigoSolicitud}`,
          'Registro realizado con éxito',
          'success'
        ).then(() => {
          this.goBandeja();
        });
      },
      error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error en el registro!'
        })
      },
      complete: () => {
        // this.vacationForm.baseForm.reset();
      },
    });
  }


  OnReemplazoSelected(value: any) {
    if (value) { return value.nombres; }
  }

  OnAprobacionSelected(value: any) {
    if (value) { return value.nombres; }
  }

}
