import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

import { BandejaService } from '@shared/services/bandeja.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { IBandejaResponse, ISolicitud } from '@shared/models/common/interfaces/bandeja.interface';
import {MatDialog} from '@angular/material/dialog';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { VacationService } from '@pages/vacation/vacation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  private _recordDownloadSub!: Subscription;
  showLoading = false;
  fruitCtrl = new FormControl('');
  filteredFruits!: Observable<string[]>;
  fruits: string[] = ['2001'];
  allFruits: string[] = ['2001', '2002', '2003', '2004', '2005'];

  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;


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
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService, private datePipe: DatePipe, 
     private route: ActivatedRoute, public dialog: MatDialog, private cookieService: CookieService, private formBuilder: FormBuilder,) {
    this.identificacion = +this.cookieService.get('identificacion');
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
  }
  
  solicitudesPendientes(): void {
    this.vacationService.identificationSubjectObsData = this.identificacion;
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlSolicitudesPendientes}`]);
    // this.router.navigate([`vacaciones/solicitudes-pendientes`, row.codSolicitud]);
  }

  filtrar(): void {
    if (this.addFilterForm.value.fecha_Inicio && this.addFilterForm.value.fecha_Fin){
      if (this.addFilterForm.value.fecha_Inicio > this.addFilterForm.value.fecha_Fin){
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

  unSubscribe(): void {
    this.showLoading = false;
    if (this._recordDownloadSub) {
      this._recordDownloadSub.unsubscribe();
    }
  }

  downloadExcelRecord(): void {
    const year = new Date().getFullYear();
    this.showLoading = true;
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this._recordDownloadSub = this.bandejaService
      .retrieveExcelReport(
        {
        },
        {}
      )
      .subscribe({
        next: (record: any) => {
          const blob = new Blob([record.body], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const element = document.createElement('a');
          element.setAttribute('download', 'report.xls');
          element.setAttribute('href', url);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          this.unSubscribe();
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
          this.unSubscribe();
        },
        complete: () => {
          console.log('Request complete');
        }
      });
  }

}
