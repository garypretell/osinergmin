import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { VacationService } from '../vacation.service';
import { BandejaService } from '@shared/services/bandeja.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { IBandejaResponse, ISolicitud } from '@shared/models/common/interfaces/bandeja.interface';
import {MatDialog} from '@angular/material/dialog';
import { DeadlinesVacationComponent } from '../shared/deadlines-vacation/deadlines-vacation.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { DetailVacationComponent } from './detail-vacation/detail-vacation.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.scss']
})
export class VacationComponent implements OnInit {
  identificacion: any;
  usuario: IBandejaResponse = {} as IBandejaResponse;
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  sortData = { place: 1, volume: 1 };
  SortType = SortType;
  sortOrder = [{ prop: 'place', dir: 'asc' }, { prop: 'volume', dir: 'asc' }];
  rows: Array<ISolicitud> = [];
  columns = [
    { name: 'created', sortable: true },
    { name: 'code', sortable: true },
    { name: 'type', sortable: true },
    { name: 'init', sortable: true },
    { name: 'end', sortable: true },
    { name: 'days', sortable: true },
    { name: 'state', sortable: true },
    { name: 'action', sortable: true },
  ];
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService,
     private route: ActivatedRoute, public dialog: MatDialog, private cookieService: CookieService) {
    this.identificacion = +this.route.snapshot.queryParams['id'];
    this.cookieService.set('identificacion', this.identificacion);
    this.vacationService.identificationSubjectObsData = this.identificacion;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.getBandeja({ identificacion: this.identificacion }).subscribe({
      next: (user: IBandejaResponse) => {
        this.usuario = user;
        this.vacationService.userSubjectObsData = user;
        this.rows = user.solicitudesVacacionales;
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
        this.usuario = {} as IBandejaResponse;
        // handle error
      },
      complete: () => {
        console.log('Request complete');
      }
    });
  }

  goRegister(): void {
    this.vacationService.userSubjectObsData = this.usuario;
    // if (this.usuario.nombres) { this.router.navigate([`vacaciones/registrar`]); }
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlRegistrarVacaciones}`]);
  }

  async setPage(pageInfo: any): Promise<any> { }

  async onSort(event: any): Promise<any> { }

  goDetail(row: any) {
    this.vacationService.userSubjectObsData = this.usuario;
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate([`vacaciones/solicitud`, row.codSolicitud]);

  }

  anular(row: any): void {
    Swal.fire({
      title: `<p>¿Está seguro de anular la solicitud</p><p>${row.codSolicitud} ?</p>`,
      // text: "No podrás revertir el proceso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.postAnular({
          identificacion: this.identificacion,
          nombres: this.usuario.nombres,
          codRegistro: row.codRegistro,
          codSolicitud: row.codSolicitud
        }).subscribe({
          next: (response: any) => { dialogRef.close(); },
          error: error => { dialogRef.close(); },
          complete: () => {
            Swal.fire(
              `Solicitud: ${row.codSolicitud}`,
              'La solicitud ha sido anulada.',
              'success'
            ).then(() => {
              this.getData();
            });
          }
        });
      }
    })
  }

  recuperar(row: any): void {
    Swal.fire({
      title: `<p>¿Está seguro de recuperar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, recuperar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.postRecuperar({
          identificacion: this.identificacion,
          nombres: this.usuario.nombres,
          codRegistro: row.codRegistro,
          codSolicitud: row.codSolicitud
        }).subscribe({
          next: (response: any) => { dialogRef.close(); },
          error: error => { dialogRef.close(); },
          complete: () => {
            Swal.fire(
              `Solicitud: ${row.codSolicitud}`,
              'La solicitud ha sido recuperada.',
              'success'
            ).then(() => {
              this.getData();
            });
          }
        });
      }
    })
  }

  enviarJefe(row: any): void {
    Swal.fire({
      title: `<p>¿Está seguro de enviar la solicitud</p><p>${row.codSolicitud} a Jefe Inmediato?</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, enviar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.postEnviarJefe({
          identificacion: this.identificacion,
          nombres: this.usuario.nombres,
          codRegistro: row.codRegistro,
          codSolicitud: row.codSolicitud
        }).subscribe({
          next: (response: any) => { dialogRef.close(); },
          error: error => { dialogRef.close(); },
          complete: () => {
            Swal.fire(
              `Solicitud: ${row.codSolicitud}`,
              'La solicitud ha sido enviada a Jefe Inm.',
              'success'
            ).then(() => {
              this.getData();
            });
          }
        });
      }
    })
  }

  reprogramar(row: any): void {
    this.vacationService.vacationSubjectObsData = row;
    const urlReprogramarVacaciones = PATH_URL_DATA.urlReprogramarVacaciones.replace(':solic', row.codSolicitud);
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${urlReprogramarVacaciones}`]);
  }

  interrumpir(row: any): void {
    this.vacationService.vacationSubjectObsData = row;
    const urlInterrupcionVacaciones = PATH_URL_DATA.urlInterrupcionVacaciones.replace(':solic', row.codSolicitud);
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${urlInterrupcionVacaciones}`]);
    // this.router.navigate([`vacaciones/interrumpir-solicitud`, row.codSolicitud]);
  }

  openModal(): void {
    this.dialog.open(DeadlinesVacationComponent, {
      width: '400px',
      autoFocus: false,
      closeOnNavigation: true,
      data: {
        saldo: this.usuario
      }
    });
  }
  
  solicitudesPendientes(): void {
    this.vacationService.identificationSubjectObsData = this.identificacion;
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlSolicitudesPendientes}`]);
    // this.router.navigate([`vacaciones/solicitudes-pendientes`, row.codSolicitud]);
  }

}
