import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IDatosRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo, IRegistroVacaionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { BaseFormVacation } from '@shared/utils/base-form-vacation';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-vacation',
  templateUrl: './register-vacation.component.html',
  styleUrls: ['./register-vacation.component.scss']
})
export class RegisterVacationComponent implements OnInit {
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
  filteredAprobado!: Observable<IEmpleadoAprobacion[]>  | undefined;
  codReemplazoValue: any;
  codAprobadoValue: any;
  steps = 0.5;
  hasDot = false;
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService, 
              private datePipe: DatePipe, public dialog: MatDialog, public vacationForm: BaseFormVacation) {}

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
    user && user.identificacion ? this.usuario = user : this.goBandeja();
    this.vacationForm.baseForm.reset();
    if(user?.identificacion) {
      this.vacationForm.baseForm.get('maxDias')?.setValue(user.saldo);
      const dialogRef = this.dialog.open(LoaderComponent, {
        width: '400px', data: {}, disableClose: true
      });
      this.bandejaService.getDatosRegistros({
        identificacion: this.usuario.identificacion,
        nombres: this.usuario.nombres
      }).subscribe({
        next: (data: IDatosRegistroResponse) => {
          this.registro = data;
          this.vacationForm.baseForm.updateValueAndValidity();
          this.pathFormData();
          this.listaEmpleadosReemplazo = data.listaEmpleadosReemplazo;
          this.listaEmpleadoAprobacion = data.listaEmpleadoAprobacion;
          this.codAprobadoValue = this.listaEmpleadoAprobacion[0].identificacion;
          this.vacationForm.baseForm.get('codEmplAprobacion')?.setValue(this.listaEmpleadoAprobacion[0].nombres);
          this.vacationForm.baseForm.get('codEmplReemplazo')?.setValue('');
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
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
    this.vacationForm.baseForm.get('dias')?.valueChanges.subscribe(change => {
      if(change) {
        this.hasDot = change.toString().includes('.');
        const result = new Date(this.vacationForm.baseForm.get('fechaInicio')?.value);
        result.setDate(result.getDate() + change);
        this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
      }
    })
    this.vacationForm.baseForm.get('fechaInicio')?.valueChanges.subscribe(change => {
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
      codRegistro:  this.registro.codRegistro,
      codigoSolicitud: this.registro.codigoSolicitud,
      diaMedio: '1',
      maxDias: this.usuario.saldo
    });
  }

  goBandeja(): void {
    this.router.navigate([`vacaciones/bandeja`], { queryParams: { id: this.vacationService.identificationValue } });
  }

  calcularDias(): any {
      this.vacationForm.baseForm.get('fechaInicio')?.setValue(new Date(this.fechaInicio));
      const result = new Date(this.fechaInicio);
      result.setDate(result.getDate() +  this.vacationForm.baseForm.get('dias')?.value);
      this.vacationForm.baseForm.get('fechaFin')?.setValue(result);
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
      dias: this.vacationForm.baseForm.get('dias')?.value.toString(),
      codEmplReemplazo: this.codReemplazoValue.toString(),
      codEmplAprobacion: this.codAprobadoValue.toString()
    }
    console.log(body);
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
        this.vacationForm.baseForm.reset();
      },
    });
  }

  OnReemplazoSelected(value: any): void {
    this.codReemplazoValue = value.identificacion;
    this.vacationForm.baseForm.get('codEmplReemplazo')?.setValue(value.nombres);
    console.log(this.vacationForm.baseForm.value);
  }

  OnAprobacionSelected(value: any): void {
    this.codAprobadoValue = value.identificacion;
    this.vacationForm.baseForm.get('codEmplAprobacion')?.setValue(value.nombres);
  }

}
