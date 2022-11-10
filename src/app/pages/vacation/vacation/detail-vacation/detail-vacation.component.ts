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
import { CookieService } from 'ngx-cookie-service';

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
  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;

  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [];
  aprobadoValue: any;
  filteredAprobado: Observable<IEmpleadoAprobacion[]> | undefined;

  steps = 0.5;
  hasDot = false;
  registroVacional: any = {};
  btnRegistrar = false;
  saldo: any;
  btnEditar = 0;
  private unsubscribe$ = new Subject();
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService, 
              private datePipe: DatePipe, public dialog: MatDialog, public vacationForm: BaseFormEditVacation, private cookieService: CookieService) {
   }

   private _filterStatesReemplazo(value: any): IEmpleadosReemplazo[] {
    const filterValue = value.nombres ? value.nombres.toLowerCase() : value.toLowerCase();

    return this.listaEmpleadosReemplazo.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  private _filterStatesAprobado(value: any): IEmpleadoAprobacion[] {
    const filterValue = value.nombres ? value.nombres.toLowerCase() : value.toLowerCase();

    return this.listaEmpleadoAprobacion.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    const user: any = this.vacationService.userValue;
    user && user.identificacion ? this.usuario = user : this.goback();
    this.vacationService.vacationValue ? this.row = this.vacationService.vacationValue : this.goback();
    if(user?.identificacion) {
      this.vacationForm.baseForm.get('maxDias')?.setValue(user.saldo);
      this.saldo = user.saldo;
      const dialogRef = this.dialog.open(LoaderComponent, {
        width: '400px', data: {}, disableClose: true
      });
      this.bandejaService.postDetalle({
        identificacion: this.cookieService.get('identificacion'),
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

          this.aprobadoValue = data.listaEmpleadoAprobacion[0];
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
        const result = new Date(change);
        result.setDate(result.getDate() + this.vacationForm.baseForm.get('dias')?.value);
        this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      }
    })
  }

  private pathFormData(): void {
    this.vacationForm.baseForm.patchValue({
      identificacion: this.cookieService.get('identificacion'),
      nombres: this.detalle.nombres,
      codRegistro:  this.detalle.registroVacional.codRegistro,
      codigoSolicitud: this.detalle.registroVacional.codSolicitud,
      diaMedio: this.detalle.registroVacional.dias.toString().includes('.') ? '1' : '0',
      maxDias: this.usuario.saldo,
      fechaModificacion: this.registroVacional.fechaModificacion,
      descTipoGoce: this.detalle.registroVacional.descTipoGoce,
      fechaRegistro: this.registroVacional.fechaRegistro,
      desEstado: this.detalle.registroVacional.desEstado,
      dias: this.detalle.registroVacional.dias,
      fechaInicio: moment(this.detalle.registroVacional.fechaInicio, "DD/MM/YYYY").toDate(),
      fechaFin: moment(this.detalle.registroVacional.fechaFin, "DD/MM/YYYY").toDate()
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

  calcularDias(): any {
    this.vacationForm.baseForm.get('fechaInicio')?.setValue(moment(this.detalle.registroVacional.fechaInicio, "DD/MM/YYYY").toDate());
      const result = moment(this.detalle.registroVacional.fechaInicio, "DD/MM/YYYY").toDate();
      result.setDate(result.getDate() +  this.vacationForm.baseForm.get('dias')?.value);
      this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      this.fechaFin = result;
  }

  editar(): void {
    this.btnRegistrar = true;
  }

  registrar(): void {

    const body: IRegistroVacaionalBody = {
      identificacion: this.cookieService.get('identificacion'),
      nombres: this.usuario.nombres,
      codRegistro:  this.registroVacional.codRegistro,
      codigoSolicitud: this.registroVacional.codSolicitud,
      codEmplReemplazo: this.vacationForm.baseForm.get('codEmplReemplazo')?.value?.identificacion,
      codEmplAprobacion: this.vacationForm.baseForm.get('codEmplAprobacion')?.value?.identificacion,
      fechaInicio: this.datePipe.transform(this.vacationForm.baseForm.get('fechaInicio')?.value, 'dd/MM/yyyy')?.toString() || '',
      fechaFin: this.datePipe.transform(this.vacationForm.baseForm.get('fechaFin')?.value, 'dd/MM/yyyy')?.toString() || '',
      dias: this.vacationForm.baseForm.get('dias')?.value,
      diaMedio: this.vacationForm.baseForm.get('dias')?.value.toString().includes('.') ? '1' : '0',
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
