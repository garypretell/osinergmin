import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IDatosRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo, IRegistroVacaionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-vacation',
  templateUrl: './register-vacation.component.html',
  styleUrls: ['./register-vacation.component.scss']
})
export class RegisterVacationComponent implements OnInit {
  today = new Date();
  fechaInicio = new Date();
  fechaFin = new Date();
  diasSolicitados = 0;
  vacaciones: any = {};
  usuario: any = {};
  registro: IDatosRegistroResponse = {} as IDatosRegistroResponse;
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
    user.identificacion ? this.usuario = user : this.goBandeja();
    if(user?.identificacion) {
      const dialogRef = this.dialog.open(LoaderComponent, {
        width: '400px', data: {}, disableClose: true
      });
      this.bandejaService.getDatosRegistros({
        identificacion: this.usuario.identificacion,
        nombres: this.usuario.nombres
      }).subscribe({
        next: (data: IDatosRegistroResponse) => {
          this.registro = data;
          this.listaEmpleadosReemplazo = data.listaEmpleadosReemplazo;
          this.listaEmpleadoAprobacion = data.listaEmpleadoAprobacion;
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

  goBandeja(): void {
    this.router.navigate([`vacaciones/bandeja`], { queryParams: { id: this.vacationService.identificationValue } });
  }

  calcularDias(): any {
    const result = new Date(this.fechaInicio);
    result.setDate(result.getDate() + this.diasSolicitados);
    this.fechaFin = result;
  }

  registrar(): void {

    const body: IRegistroVacaionalBody = {
      identificacion: this.usuario.identificacion,
      nombres: this.usuario.nombres,
      codRegistro:  this.registro.codRegistro,
      codigoSolicitud: this.registro.codigoSolicitud,
      diaMedio: '0',
      fechaInicio: this.datePipe.transform(this.fechaInicio, 'dd/MM/yyyy')?.toString() || '',
      fechaFin: this.datePipe.transform(this.fechaFin, 'dd/MM/yyyy')?.toString() || '',
      dias: this.diasSolicitados.toString(),
      codEmplReemplazo: this.codReemplazoValue.toString(),
      codEmplAprobacion: this.codAprobadoValue.toString()
    }
    console.log(body);
    this.bandejaService.postRegistro(body).subscribe({
      next: (data: IDatosRegistroResponse) => {
        Swal.fire(
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
    });
  }

  OnReemplazoSelected(value: any): void {
    this.codReemplazoValue = value.identificacion;
  }

  OnAprobacionSelected(value: any): void {
    this.codAprobadoValue = value.identificacion;
  }

}
