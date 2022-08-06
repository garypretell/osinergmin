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
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BaseFormEditVacation } from '@shared/utils/base-form-edit-vacation';
import { CookieService } from 'ngx-cookie-service';
import { VacationService } from '@pages/vacation/vacation.service';

@Component({
  selector: 'app-request-pending-detail',
  templateUrl: './request-pending-detail.component.html',
  styleUrls: ['./request-pending-detail.component.scss']
})
export class RequestPendingDetailComponent implements OnInit, OnDestroy {
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
        this.hasDot = change.toString().includes('.');
        const result = new Date(change);
        result.setDate(result.getDate() + this.vacationForm.baseForm.get('dias')?.value);
        this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      }
    })
  }

  calcularDias(): any {
    
    // this.vacationForm.baseForm.get('fechaInicio')?.setValue(moment(this.detalle.registroVacional.fechaInicio, "DD/MM/YYYY").toDate());
    //   const result = moment(this.detalle.registroVacional.fechaInicio, "DD/MM/YYYY").toDate();
    //   result.setDate(result.getDate() +  this.vacationForm.baseForm.get('dias')?.value);
    //   this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
    //   this.fechaFin = result;
  }

  private pathFormData(): void {
    this.vacationForm.baseForm.patchValue({
      identificacion: this.cookieService.get('identificacion'),
      nombres: this.detalle.nombres,
      codRegistro:  this.detalle.registroVacional.codRegistro,
      codigoSolicitud: this.detalle.registroVacional.codSolicitud,
      diaMedio: '1',
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
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlSolicitudesPendientes}`]);
  }

  OnReemplazoSelected(value: any) {
    if (value) { return value.nombres; }
  }

  OnAprobacionSelected(value: any) {
    if (value) { return value.nombres; }
  }

  aprobar(): void {
    const row = this.vacationService.vacationValue;
    Swal.fire({
      title: `<p>¿Está seguro de aprobar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      // text: "No podrás revertir el proceso!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aprobar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px',
          data: {},
          disableClose: true,
        });
        this.bandejaService
          .postAprobar({
            identificacion: this.identificacion,
            nombres: row.nombres,
            codRegistro: row.codRegistro,
            codSolicitud: row.codSolicitud,
          })
          .subscribe({
            next: (response: any) => {
              dialogRef.close();
            },
            error: (error) => {
              dialogRef.close();
            },
            complete: () => {
              Swal.fire(
                `Solicitud: ${row.codSolicitud}`,
                'La solicitud ha sido aprobada.',
                'success'
              ).then(() => {
                this.goback();
              });
            },
          });
      }
    });
  }

  async rechazar(): Promise<void> {
    const row = this.vacationService.vacationValue;
    Swal.fire({
      title: `<p>¿Está seguro de rechazar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      html: `<div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">Motivo:</label>
              <textarea class="form-control" id="comentario" placeholder="Comentario" rows="3"></textarea>
            </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, rechazar!',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputElement = Swal.getPopup()?.querySelector('#comentario') as HTMLInputElement;
        const comentario: any = inputElement.value;
        if (!comentario ) {
          Swal.showValidationMessage(`Ingrese Motivo de rechazo`);
        }
        return { comentario }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px',
          data: {},
          disableClose: true,
        });
        this.bandejaService
          .postRechazar({
            identificacion: this.identificacion,
            nombres: row.nombres,
            codRegistro: row.codRegistro,
            codSolicitud: row.codSolicitud,
            comentario: result?.value?.comentario ? result?.value?.comentario : '',
          })
          .subscribe({
            next: (response: any) => {
              dialogRef.close();
            },
            error: (error) => {
              dialogRef.close();
            },
            complete: () => {
              Swal.fire(
                `Solicitud: ${row.codSolicitud}`,
                'La solicitud ha sido rechazada.',
                'success'
              ).then(() => {
                this.goback();
              });
            },
          });
      }
    });
  }

}
