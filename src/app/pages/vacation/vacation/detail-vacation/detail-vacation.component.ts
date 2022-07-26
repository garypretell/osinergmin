import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IDatosRegistroResponse, IDetalleRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo, IRegistroVacaionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { VacationService } from '../../vacation.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BaseFormEditVacation } from '@shared/utils/base-form-edit-vacation';

@Component({
  selector: 'app-detail-vacation',
  templateUrl: './detail-vacation.component.html',
  styleUrls: ['./detail-vacation.component.scss']
})
export class DetailVacationComponent implements OnInit, OnDestroy {
  fechaInicio = new Date();
  fechaFin = new Date();
  diasSolicitados = 1;
  actualizado = new Date();
  usuario: any = {};
  row: any = {};
  detalle: any = {};
  identificacion: any;

  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  reemplazoValue: any;
  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;;

  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [];
  aprobadoValue: any;
  filteredAprobado: Observable<IEmpleadoAprobacion[]> | undefined;;

  steps = 0.5;
  hasDot = false;
  registroVacional: any = {};
  btnRegistrar = false;
  saldo: any;
  btnEditar = 0;
  private unsubscribe$ = new Subject();
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService, 
              private datePipe: DatePipe, public dialog: MatDialog, public vacationForm: BaseFormEditVacation) {
   }

   private _filterStatesReemplazo(value: any): IEmpleadosReemplazo[] {
    const filterValue = value.nombres.toLowerCase();

    return this.listaEmpleadosReemplazo.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  private _filterStatesAprobado(value: any): IEmpleadoAprobacion[] {
    const filterValue = value.nombres.toLowerCase();

    return this.listaEmpleadoAprobacion.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const user: any = this.vacationService.userValue;
    console.log(user);
    user.identificacion ? this.usuario = user : this.goback();
    this.vacationService.vacationValue ? this.row = this.vacationService.vacationValue : this.goback();
    if(user?.identificacion) {
      this.vacationForm.baseForm.get('maxDias')?.setValue(user.saldo);
      this.saldo = user.saldo;
      const dialogRef = this.dialog.open(LoaderComponent, {
        width: '400px', data: {}, disableClose: true
      });
      this.bandejaService.postDetalle({
        identificacion: this.usuario.identificacion,
        nombres: this.usuario.nombres,
        codRegistro: this.row.codRegistro,
        codSolicitud: this.row.codSolicitud
      }).subscribe({
        next: (data: IDetalleRegistroResponse) => {
          this.detalle = data;
          this.btnEditar = data.registroVacional.codEstado;
          this.registroVacional = data.registroVacional;
          this.vacationForm.baseForm.updateValueAndValidity();
          this.pathFormData();

          this.aprobadoValue = data.listaEmpleadoAprobacion.find(x => x.identificacion === data.registroVacional.codEmplAprobacion);
          this.reemplazoValue = data.listaEmpleadosReemplazo.find(x => x.identificacion === data.registroVacional.codEmplReemplazo);
          this.listaEmpleadosReemplazo = data.listaEmpleadosReemplazo;
          this.listaEmpleadoAprobacion = data.listaEmpleadoAprobacion;
          this.vacationForm.baseForm.get('codEmplAprobacion')?.setValue(this.aprobadoValue);
          this.vacationForm.baseForm.get('codEmplReemplazo')?.setValue(this.reemplazoValue);
          this.diasSolicitados = data.registroVacional.dias;
          this.calcularDias();
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
          // handle error
        },
        complete: () => {
          this.filteredReemplazo = this.vacationForm.baseForm.get('codEmplReemplazo')?.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice())),
          );
          this.filteredAprobado = this.vacationForm.baseForm.get('codEmplAprobacion')?.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterStatesAprobado(state) : this.listaEmpleadoAprobacion.slice())),
          );
        }
      });
    }
    this.calcularDias();
    this.vacationForm.baseForm.get('dias')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(change => {
      if(change) {
        this.hasDot = change.toString().includes('.');
        const result = new Date(this.vacationForm.baseForm.get('fechaInicio')?.value);
        result.setDate(result.getDate() + change);
        this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      }
    })
    this.vacationForm.baseForm.get('fechaInicio')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(change => {
      if(change) {
        this.hasDot = change.toString().includes('.');
        const result = new Date(change);
        result.setDate(result.getDate() + this.vacationForm.baseForm.get('dias')?.value);
        this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      }
    })
  }

  private pathFormData(): void {
    this.vacationForm.baseForm.patchValue({
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro:  this.row.codRegistro,
      codigoSolicitud: this.row.codSolicitud,
      diaMedio: '1',
      maxDias: this.usuario.saldo,
      fechaModificacion: this.registroVacional.fechaModificacion,
      descTipoGoce: this.row.descTipoGoce,
      fechaRegistro: this.registroVacional.fechaRegistro,
      desEstado: this.row.desEstado,
      fechaInicio: moment(this.detalle.registroVacional.fechaInicio, "DD/MM/YYYY").toDate(),
      fechaFin: moment(this.detalle.registroVacional.fechaFin, "DD/MM/YYYY").toDate()
    });
  }

  goback(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.vacationService.identificationValue } });
  }

  OnReemplazoSelected(value: any) {
    if (value) { return value.nombres; }
  }

  OnAprobacionSelected(value: any) {
    if (value) { return value.nombres; }
  }

  calcularDias(): any {
    this.vacationForm.baseForm.get('fechaInicio')?.setValue(new Date(this.fechaInicio));
      const result = new Date(this.fechaInicio);
      result.setDate(result.getDate() +  this.vacationForm.baseForm.get('dias')?.value);
      this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      this.fechaFin = result;
  }

  editar(): void {
    this.btnRegistrar = true;
  }

  registrar(): void {

    const body: IRegistroVacaionalBody = {
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro:  this.registroVacional.codRegistro,
      codigoSolicitud: this.registroVacional.codSolicitud,
      codEmplReemplazo: this.vacationForm.baseForm.get('codEmplAprobacion')?.value?.identificacion,
      codEmplAprobacion: this.vacationForm.baseForm.get('codEmplReemplazo')?.value?.identificacion,
      fechaInicio: this.datePipe.transform(this.fechaInicio, 'dd/MM/yyyy')?.toString() || '',
      fechaFin: this.datePipe.transform(this.fechaFin, 'dd/MM/yyyy')?.toString() || '',
      dias: this.vacationForm.baseForm.get('dias')?.value,
      diaMedio: '0'
    }
    this.bandejaService.postActualizar(body).subscribe({
      next: (data: IDatosRegistroResponse) => {
        Swal.fire(
          `Solicitud : ${this.registroVacional.codSolicitud}`,
          'Actualización exitosa!',
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
    });
  }

}
