import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { VacationService } from '../vacation.service';
import { BandejaService } from '@shared/services/bandeja.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { IBandejaResponse, ISolicitud } from '@shared/models/common/interfaces/bandeja.interface';
import { MatDialog } from '@angular/material/dialog';
import { DeadlinesVacationComponent } from '../shared/deadlines-vacation/deadlines-vacation.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { DetailVacationComponent } from './detail-vacation/detail-vacation.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TrazabilityVacationComponent } from '../shared/trazability-vacation/trazability-vacation.component';
import { AlertComponent } from '@shared/components/alert/alert.component';


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


  filtros: any[] = [];
  public addFilterForm: FormGroup;
  selectable = true;
  removable = true;

  fileToUpload: any;
  hintColor = '#ff0000'
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService, private datePipe: DatePipe,
    private route: ActivatedRoute, public dialog: MatDialog, private cookieService: CookieService, private formBuilder: FormBuilder,) {
    this.identificacion = +this.cookieService.get('isLoggedIn');
    this.cookieService.set('identificacion', this.identificacion);
    this.vacationService.identificationSubjectObsData = this.identificacion;

    this.addFilterForm = this.formBuilder.group({
      fecha_Inicio: ['', []],
      fecha_Fin: ['', []],
      tipo_contratacion: ['', []],
      area: ['', []],
      periodo: ['', []],
    });
  }

  ngOnInit(): void {
    this.getData();
    console.log('25-10-2022')
  }

  async logout() {
    await new Promise((resolve, reject) => {
      try {
        this.cookieService.delete('isLoggedIn', '/')
        this.cookieService.delete('identificacion', '/')
        resolve(true)
      }
      catch (err) {
        reject(false)
      }

    }).then(() => {
      // this.router.navigateByUrl('/home')
    })
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.getBandeja({ identificacion: this.identificacion }).subscribe({
      next: async (user: IBandejaResponse) => {
        this.usuario = user;
        this.vacationService.userSubjectObsData = user;
        this.rows = user.solicitudesVacacionales;
        dialogRef.close();
        if (user.acceso === 2 || user.acceso === 3) {
          const alert: any = {};
          alert.title = '¡Acceso restringido para este usuario!';
          alert.message = user.accesoDescripcion;
          alert.close = true;
          alert.showIcon = true;
          alert.btnClose = true;

          const dialogRef2 = this.dialog.open(AlertComponent, {
            width: '400px', data: { alert: alert }, disableClose: true
          });
          // await this.logout();
        }
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

  goReport(): void {
    this.vacationService.userSubjectObsData = this.usuario;
    // if (this.usuario.nombres) { this.router.navigate([`vacaciones/registrar`]); }
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlReporte}`]);
  }

  goReportHistory(): void {
    this.vacationService.userSubjectObsData = this.usuario;
    // if (this.usuario.nombres) { this.router.navigate([`vacaciones/registrar`]); }
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlReporteHistorico}`]);
  }

  goUser(): void {
    this.vacationService.userSubjectObsData = this.usuario;
    // if (this.usuario.nombres) { this.router.navigate([`vacaciones/usuarios`]); }
    this.router.navigate([`${PATH_URL_DATA.urlUsuarios}`]);
  }

  goRequestReport(): void {
    this.vacationService.userSubjectObsData = this.usuario;
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlReporteSolicitudes}`]);
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

  actualizar(row: any) {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.getActualizar().subscribe({
      next: (response: any) => {
        this.usuario.saldo--;
        dialogRef.close();
      },
      error: error => { dialogRef.close(); },
    })
  }

  eliminar(row: any) {
    Swal.fire({
      title: `<p>¿Está seguro de eliminar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.postEliminar({
          codRegistro: row.codRegistro
        }).subscribe({
          next: (response: any) => { dialogRef.close(); },
          error: error => { dialogRef.close(); },
          complete: () => {
            Swal.fire(
              `Solicitud: ${row.codSolicitud}`,
              'La solicitud ha sido eliminada.',
              'success'
            ).then(() => {
              this.getData();
            });
          }
        });
      }
    })
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
  }

  solicitudesPendientesGrh(): void {
    this.vacationService.identificationSubjectObsData = this.identificacion;
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlSolicitudesPendientesGrh}`]);
  }

  filtrar(): void {
    if (this.addFilterForm.value.fecha_Inicio && this.addFilterForm.value.fecha_Fin) {
      if (this.addFilterForm.value.fecha_Inicio > this.addFilterForm.value.fecha_Fin) {
        Swal.fire(
          'Advertencia!',
          'Fecha de Inicio debe ser menor a Fecha Fin!',
          'info'
        );
        return;
      }
    }
    this.filtros = [];

    this.filtro();
  }

  remove(filtro: any): void {
    this.addFilterForm.get(filtro.id)?.setValue('');
    const index = this.filtros.indexOf(filtro);
    if (index >= 0) {
      this.filtros.splice(index, 1);
    }
    this.filtrar();
  }

  clearAll(): void {
    this.filtros = [];
    Object.keys(this.addFilterForm.value).forEach((key) => {
      this.addFilterForm.get(key)?.setValue('');
    });
    this.filtrar();
  }

  filtro(): any {
    Object.keys(this.addFilterForm.value).forEach((key) => {
      if (this.addFilterForm.value[key]) {
        switch (key) {
          case 'area':
          case 'periodo':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key] });
            break;
          case 'tipo_contratacion':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key].descripcion });
            break;
          default:
            this.filtros.push({ id: key, name: this.datePipe.transform(this.addFilterForm.value[key], 'dd/MM/yyyy') });
        }
      }
    });
  }

  verTrazabilidad(row: any): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.getListaTraza({ codRegistro: row.codRegistro }).subscribe({
      next: (record: any) => {
        dialogRef.close();
        this.dialog.open(TrazabilityVacationComponent, {
          width: '850px',
          autoFocus: false,
          closeOnNavigation: true,
          data: record
        });
      },
      error: error => {
        dialogRef.close();
      },
    })
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.fileToUpload = file;
  }

}
