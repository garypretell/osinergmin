import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { IDatosRegistroResponse, IEmpleadoAprobacion, IEmpleadosReemplazo, IRegistroVacaionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaService } from '@shared/services/bandeja.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [
    {
      "identificacion": 1072092,
      "nombres": "NOM-morasyhvbigf APE-daojzvvmzgrtq"
  },
  {
      "identificacion": 1048994,
      "nombres": "NOM-rfiplsgvtkfix APE-cwyphrryinyaoisv"
  },
  {
      "identificacion": 1106741,
      "nombres": "NOM-sgvrlkcupyl APE-cwqevcyfvhxpzjjj"
  },
  {
      "identificacion": 1094507,
      "nombres": "NOM-ftqhzguzwr APE-jegzcmgjpxbgnzw"
  }
  ];
  reemplazoCtrl = new FormControl('');
  reemplazoValue: any;
  filteredReemplazo!: Observable<IEmpleadosReemplazo[]>;

  listaEmpleadoAprobacion: Array<IEmpleadoAprobacion> = [
    {
      "identificacion": 1072092,
      "nombres": "NOM-morasyhvbigf APE-daojzvvmzgrtq"
  },
  {
      "identificacion": 1048994,
      "nombres": "NOM-rfiplsgvtkfix APE-cwyphrryinyaoisv"
  },
  {
      "identificacion": 1106741,
      "nombres": "NOM-sgvrlkcupyl APE-cwqevcyfvhxpzjjj"
  },
  {
      "identificacion": 1094507,
      "nombres": "NOM-ftqhzguzwr APE-jegzcmgjpxbgnzw"
  }
  ];
  aprobadoCtrl = new FormControl('');
  aprobadoValue: any;
  filteredAprobado!: Observable<IEmpleadoAprobacion[]>;
  constructor(private router: Router, private vacationService: VacationService, private bandejaService: BandejaService) {
    this.filteredReemplazo = this.reemplazoCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice())),
    );
    this.filteredAprobado = this.aprobadoCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStatesAprobado(state) : this.listaEmpleadoAprobacion.slice())),
    );
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
      this.bandejaService.getDatosRegistros({
        identificacion: this.usuario.identificacion,
        nombres: this.usuario.nombres
      }).subscribe({
        next: (data: IDatosRegistroResponse) => {
          this.registro = data;
        },
        error: error => {
          // handle error
        },
        complete: () => {
          console.log('Request complete');
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

}
