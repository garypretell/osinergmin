import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IDatosRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { BaseFormReschedule } from '@shared/utils/base-form-reschedule';
import { startWith, map, Observable } from 'rxjs';
import { VacationService } from '../../vacation.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reschedule-vacation',
  templateUrl: './reschedule-vacation.component.html',
  styleUrls: ['./reschedule-vacation.component.scss']
})
export class RescheduleVacationComponent implements OnInit {
  today = new Date();
  fechaInicio = new Date();
  fechaFin = new Date();

  detalle: any = {};
  usuario: any = {};
  row: any = {};
  registro: any = {};

  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;
  filteredAprobado!: Observable<IEmpleadoAprobacion[]> | undefined;

  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [];

  codReemplazoValue: any;
  codAprobadoValue: any;

  steps = 0.5;
  hasDot = false;
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService,
    private datePipe: DatePipe, public dialog: MatDialog, public rescheduleForm: BaseFormReschedule) { }

  private _filterStatesReemplazo(value: string): IEmpleadosReemplazo[] {
    const filterValue = value.toLowerCase();

    return this.listaEmpleadosReemplazo.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  private _filterStatesAprobado(value: string): IEmpleadoAprobacion[] {
    const filterValue = value.toLowerCase();

    return this.listaEmpleadoAprobacion.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    const user: any = this.vacationService.userValue;
    user && user.identificacion ? this.usuario = user : this.goback();
    this.vacationService.vacationValue ? this.row = this.vacationService.vacationValue : this.goback();
    this.rescheduleForm.baseForm.reset();
    this.rescheduleForm.baseForm.get('diasReprogramacion')?.setValue(1);
    if (user?.identificacion) {
      const dialogRef = this.dialog.open(LoaderComponent, {
        width: '400px', data: {}, disableClose: true
      });
      this.bandejaService.getReprogramacion({
        identificacion: this.usuario.identificacion,
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
          this.codAprobadoValue = this.listaEmpleadoAprobacion[0].identificacion;
          this.rescheduleForm.baseForm.get('codEmplAprobacionReprogramacion')?.setValue(this.listaEmpleadoAprobacion[0].nombres);
          this.rescheduleForm.baseForm.get('codEmplReemplazoReprogramacion')?.setValue('');
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
        },
        complete: () => {
          this.filteredReemplazo = this.rescheduleForm.baseForm.get('codEmplReemplazoReprogramacion')?.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice())),
          );
          this.filteredAprobado = this.rescheduleForm.baseForm.get('codEmplAprobacionReprogramacion')?.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterStatesAprobado(state) : this.listaEmpleadoAprobacion.slice())),
          );
        }
      });
    }
    this.calcularDias();
    this.rescheduleForm.baseForm.get('diasReprogramacion')?.valueChanges.subscribe(change => {
      if (change) {
        this.hasDot = change.toString().includes('.');
        const result = new Date(this.rescheduleForm.baseForm.get('fechaInicioReprogramacion')?.value);
        result.setDate(result.getDate() + change);
        this.rescheduleForm.baseForm.get('fechaFinReprogramacion')?.setValue(result);
      }
    })
    this.rescheduleForm.baseForm.get('fechaInicioReprogramacion')?.valueChanges.subscribe(change => {
      if (change) {
        this.hasDot = change.toString().includes('.');
        const result = new Date(change);
        result.setDate(result.getDate() + this.rescheduleForm.baseForm.get('diasReprogramacion')?.value);
        this.rescheduleForm.baseForm.get('fechaFinReprogramacion')?.setValue(result);
      }
    })
  }

  calcularDias(): any {
    this.rescheduleForm.baseForm.get('fechaInicioReprogramacion')?.setValue(new Date(this.fechaInicio));
    const result = new Date(this.fechaInicio);
    result.setDate(result.getDate() + this.rescheduleForm.baseForm.get('diasReprogramacion')?.value);
    this.rescheduleForm.baseForm.get('fechaFinReprogramacion')?.setValue(result);
    this.fechaFin = result;
  }

  private pathFormData(): void {
    this.rescheduleForm.baseForm.patchValue({
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro: this.registro.verRegistroVacacional.registroVacional.codRegistro,
      codRegistroReprogramacion: this.registro.datosReprogramacionVacional.codRegistro,
      codSolicitud: this.registro.verRegistroVacacional.registroVacional.codSolicitud,
      codigoSolicitudReprogramacion: this.registro.datosReprogramacionVacional.codigoSolicitud,
      fechaInicio: moment(this.registro.verRegistroVacacional.registroVacional.fechaInicio, "DD/MM/YYYY").toDate(),
      fechaFin: moment(this.registro.verRegistroVacacional.registroVacional.fechaFin, "DD/MM/YYYY").toDate(),
      dias: this.registro.verRegistroVacacional.registroVacional.dias

    });
  }

  goback(): void {
    this.router.navigate([`vacaciones/bandeja`], { queryParams: { id: this.vacationService.identificationValue } });
  }

  OnReemplazoSelected(value: any): void {
    console.log(value);
    this.codReemplazoValue = value.identificacion;
    this.rescheduleForm.baseForm.get('codEmplReemplazoReprogramacion')?.setValue(value.nombres);
  }

  OnAprobacionSelected(value: any): void {
    this.codAprobadoValue = value.identificacion;
    this.rescheduleForm.baseForm.get('codEmplAprobacionReprogramacion')?.setValue(value.nombres);
  }

  registrar(): void {

    const body: any = {
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro:  this.rescheduleForm.baseForm.get('codRegistro')?.value,
      codRegistroReprogramacion: this.rescheduleForm.baseForm.get('codRegistroReprogramacion')?.value,
      codigoSolicitudReprogramacion: this.rescheduleForm.baseForm.get('codigoSolicitudReprogramacion')?.value,
      codEmplReemplazoReprogramacion: this.codReemplazoValue,
      codEmplAprobacionReprogramacion: this.codAprobadoValue,
      fechaInicioReprogramacion: this.datePipe.transform(this.fechaInicio, 'dd/MM/yyyy')?.toString() || '',
      fechaFinReprogramacion: this.datePipe.transform(this.fechaFin, 'dd/MM/yyyy')?.toString() || '',
      diasReprogramacion: this.rescheduleForm.baseForm.get('diasReprogramacion')?.value || '',
      diaMedioReprogramacion: '0'
    }
    console.log(body);
    this.bandejaService.postReprogramacion(body).subscribe({
      next: (data: any) => {
        Swal.fire(
          `Solicitud : ${this.rescheduleForm.baseForm.get('codigoSolicitudReprogramacion')?.value}`,
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
        this.rescheduleForm.baseForm.reset();
      },
    });
  }

}
