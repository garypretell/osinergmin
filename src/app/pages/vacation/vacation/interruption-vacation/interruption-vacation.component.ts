import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { VacationService } from '../../vacation.service';
import { BandejaService } from '@shared/services/bandeja.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { IEmpleadoAprobacion, IEmpleadosReemplazo } from '@shared/models/common/interfaces/bandeja.interface';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { map, startWith, takeUntil, debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BaseFormInterruption } from '@shared/utils/base-form-interruption';

@Component({
  selector: 'app-interruption-vacation',
  templateUrl: './interruption-vacation.component.html',
  styleUrls: ['./interruption-vacation.component.scss']
})
export class InterruptionVacationComponent implements OnInit {
  row: any = {};
  detalle: any = {};
  usuario: any = {};

  registro: any = {};

  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  reemplazoValue: any;
  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;

  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [];
  aprobadoValue: any;
  filteredAprobado: Observable<IEmpleadoAprobacion[]> | undefined;

  fechaInicio = new Date();
  fechaFin = new Date();
  diasSolicitados = 1;
  steps = 0.5;
  hasDot = false;
  hasDotRep = false;
  registroVacional: any = {};
  private unsubscribe$ = new Subject();
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService,
    private datePipe: DatePipe, public dialog: MatDialog, public rescheduleForm: BaseFormInterruption, private cookieService: CookieService) {
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
    this.vacationService.vacationValue ? this.row = this.vacationService.vacationValue : this.goback();
    this.vacationService.userValue ? this.usuario = this.vacationService.userValue : this.goback();

    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.rescheduleForm.baseForm.reset();
    this.bandejaService.getReprogramacion({
      identificacion: this.cookieService.get('identificacion'),
      nombres: this.usuario.nombres,
      codRegistro: this.row.codRegistro,
      codSolicitud: this.row.codSolicitud
    }).subscribe({
      next: (data: any) => {
          this.registro = data;
          this.rescheduleForm.baseForm.updateValueAndValidity();
          this.pathFormData();
          this.listaEmpleadosReemplazo = data.datosReprogramacionVacional.listaEmpleadosReemplazo;
          this.listaEmpleadoAprobacion = data.datosReprogramacionVacional.listaEmpleadoAprobacion;
          this.rescheduleForm.baseForm.get('codEmplAprobacionInterruptida')?.setValue(this.listaEmpleadoAprobacion[0]);
          this.rescheduleForm.baseForm.get('codEmplReemplazoInterruptida')?.setValue('');
          this.calcularDiasBefore();
          dialogRef.close();
      },
      error: error => {
        dialogRef.close();
        // handle error
      },
      complete: () => {
        this.filteredReemplazo = this.rescheduleForm.baseForm.get('codEmplReemplazoInterruptida')?.valueChanges.pipe(
          debounceTime(300),
          startWith(''),
          map(state => (state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice())),
        );
        this.filteredAprobado = this.rescheduleForm.baseForm.get('codEmplAprobacionInterruptida')?.valueChanges.pipe(
          debounceTime(300),
          startWith(''),
          map(state => (state ? this._filterStatesAprobado(state) : this.listaEmpleadoAprobacion.slice())),
        );
      }
    });

    this.rescheduleForm.baseForm.get('fechaInterruptida')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(change => {
      if (change) {
        const fecha2 = moment(change);
        const fecha1 = moment(this.rescheduleForm.baseForm.get('fechaInicio')?.value);
        this.rescheduleForm.baseForm.get('diasInterruptidas')?.setValue(+this.rescheduleForm.baseForm.get('dias')?.value-fecha2.diff(fecha1, 'days'));
      }
    })

  }

  calcularDiasBefore(): any {
    this.rescheduleForm.baseForm.get('fechaInicio')?.setValue( moment(this.registro.verRegistroVacacional.registroVacional.fechaInicio, "DD/MM/YYYY").toDate());
    const result =  moment(this.registro.verRegistroVacacional.registroVacional.fechaInicio, "DD/MM/YYYY").toDate();
    result.setDate(result.getDate() + Math.round(this.rescheduleForm.baseForm.get('dias')?.value) -1);
    this.rescheduleForm.baseForm.get('fechaFin')?.setValue(result);
  }

  private pathFormData(): void {
    this.rescheduleForm.baseForm.patchValue({
      identificacion: this.cookieService.get('identificacion'),
      nombres: this.usuario.nombres,
      codRegistro: this.registro.verRegistroVacacional.registroVacional.codRegistro,
      codRegistroInterruptida: this.registro.datosReprogramacionVacional.codRegistro,
      codSolicitud: this.registro.verRegistroVacacional.registroVacional.codSolicitud,
      codigoSolicitudInterruptida: this.registro.datosReprogramacionVacional.codigoSolicitud,
      fechaInicio: moment(this.registro.verRegistroVacacional.registroVacional.fechaInicio, "DD/MM/YYYY").toDate(),
      fechaFin: moment(this.registro.verRegistroVacacional.registroVacional.fechaFin, "DD/MM/YYYY").toDate(),
      dias: this.registro.verRegistroVacacional.registroVacional.dias
    });
  }

  goback(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
  }

  OnReemplazoSelected(value: any) {
    if (value) { return value.nombres; }
  }

  OnAprobacionSelected(value: any) {
    if (value) { return value.nombres; }
  }

  interrumpir(): void {

    const body: any = {
      identificacion: this.cookieService.get('identificacion'),
      nombres: this.usuario.nombres,
      codRegistro:  this.rescheduleForm.baseForm.get('codRegistro')?.value,
      codSolicitud:  this.rescheduleForm.baseForm.get('codSolicitud')?.value,
      codRegistroInterruptida: this.rescheduleForm.baseForm.get('codRegistroInterruptida')?.value,
      codigoSolicitudInterruptida: this.rescheduleForm.baseForm.get('codigoSolicitudInterruptida')?.value,
      codEmplReemplazoInterruptida: this.rescheduleForm.baseForm.get('codEmplReemplazoInterruptida')?.value.identificacion,
      codEmplAprobacionInterruptida: this.rescheduleForm.baseForm.get('codEmplAprobacionInterruptida')?.value.identificacion,
      fechaInicioReprogramacion: this.datePipe.transform(this.rescheduleForm.baseForm.get('fechaInicio')?.value, 'dd/MM/yyyy')?.toString() || '',
      fechaInterruptida: this.datePipe.transform(this.rescheduleForm.baseForm.get('fechaInterruptida')?.value.setDate(this.rescheduleForm.baseForm.get('fechaInterruptida')?.value.getDate()-1), 'dd/MM/yyyy')?.toString() || '',
      diaMedioInterruptida: this.rescheduleForm.baseForm.get('dias')?.value.toString().includes('.') ? 1 : 0,
      diasInterruptidas: this.rescheduleForm.baseForm.get('diasInterruptidas')?.value || '',
      dias: (+this.rescheduleForm.baseForm.get('dias')?.value) - (+this.rescheduleForm.baseForm.get('diasInterruptidas')?.value) ,
    }

    this.bandejaService.postInterrupcion(body).subscribe({
      next: (data: any) => {
        Swal.fire(
          `Solicitud : ${this.rescheduleForm.baseForm.get('codigoSolicitudInterruptida')?.value}`,
          'Registro realizado con éxito',
          'success'
        ).then(() => {
          this.goback();
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
        // this.rescheduleForm.baseForm.reset();
      },
    });
  }

}