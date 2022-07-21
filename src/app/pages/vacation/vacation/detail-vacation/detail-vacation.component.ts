import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IDatosRegistroResponse, IDetalleRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo, IRegistroVacaionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VacationService } from '../../vacation.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-vacation',
  templateUrl: './detail-vacation.component.html',
  styleUrls: ['./detail-vacation.component.scss']
})
export class DetailVacationComponent implements OnInit {
  fechaInicio = new Date();
  fechaFin = new Date();
  diasSolicitados = 1;
  actualizado = new Date();
  usuario: any = {};
  row: any = {};
  detalle: any = {};
  identificacion: any;

  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  reemplazoCtrl = new FormControl('');
  reemplazoValue: any;
  filteredReemplazo!: Observable<IEmpleadosReemplazo[]>;

  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [];
  aprobadoCtrl = new FormControl('');
  aprobadoValue: any;
  filteredAprobado!: Observable<IEmpleadoAprobacion[]>;
  codReemplazoValue: any;
  codAprobadoValue: any;
  steps = 0.5;
  hasDot = false;
  registroVacional: any = {};
  btnRegistrar = false;
  saldo: any;
  btnEditar = 0;
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService, private datePipe: DatePipe, public dialog: MatDialog) {
   }

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
    user.identificacion ? this.usuario = user : this.goback();
    this.vacationService.vacationValue ? this.row = this.vacationService.vacationValue : this.goback();
    if(user?.identificacion) {
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
          this.codReemplazoValue = data.registroVacional.codEmplReemplazo;
          this.codAprobadoValue = data.registroVacional.codEmplAprobacion;
          this.aprobadoValue = data.listaEmpleadoAprobacion.find(x => x.identificacion === data.registroVacional.codEmplAprobacion)?.nombres;
          this.reemplazoValue = data.listaEmpleadosReemplazo.find(x => x.identificacion === data.registroVacional.codEmplReemplazo)?.nombres;
          this.listaEmpleadosReemplazo = data.listaEmpleadosReemplazo;
          this.listaEmpleadoAprobacion = data.listaEmpleadoAprobacion;
          this.fechaInicio = moment(data.registroVacional.fechaInicio, "DD/MM/YYYY").toDate();
          this.fechaFin =  moment(data.registroVacional.fechaFin, "DD/MM/YYYY").toDate();
          this.diasSolicitados = data.registroVacional.dias;
          this.calcularDias();
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
          // handle error
        },
        complete: () => {
          this.filteredReemplazo = this.reemplazoCtrl.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice())),
          );
          this.filteredAprobado = this.aprobadoCtrl.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterStatesAprobado(state) : this.listaEmpleadoAprobacion.slice())),
          );
        }
      });
    }
  }

  goback(): void {
    this.router.navigate([`vacaciones/bandeja`], { queryParams: { id: this.vacationService.identificationValue } });
  }

  OnReemplazoSelected(value: any): void {
    this.codReemplazoValue = value.identificacion;
  }

  OnAprobacionSelected(value: any): void {
    this.codAprobadoValue = value.identificacion;
  }

  calcularDias(): any {
    if(this.diasSolicitados) {
      this.hasDot = this.diasSolicitados.toString().includes('.');
      const result = new Date(this.fechaInicio);
      result.setDate(result.getDate() + this.diasSolicitados);
      this.fechaFin = result;
    }
    // this.vacationForm.baseForm.get('fechaInicio')?.setValue(new Date(this.fechaInicio));
    //   const result = new Date(this.fechaInicio);
    //   result.setDate(result.getDate() +  this.vacationForm.baseForm.get('dias')?.value);
    //   this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
    //   this.fechaFin = result;
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
      codEmplReemplazo: this.codReemplazoValue.toString(),
      codEmplAprobacion: this.codAprobadoValue.toString(),
      fechaInicio: this.datePipe.transform(this.fechaInicio, 'dd/MM/yyyy')?.toString() || '',
      fechaFin: this.datePipe.transform(this.fechaFin, 'dd/MM/yyyy')?.toString() || '',
      dias: this.diasSolicitados.toString(),
      diaMedio: '0'
    }
    console.log(body);
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
