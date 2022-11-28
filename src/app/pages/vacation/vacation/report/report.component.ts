import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

import { BandejaService } from '@shared/services/bandeja.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { IBandejaResponse, IFiltrosReporte, IListaGerencias, IListaModalidades, IListaPeriodos } from '@shared/models/common/interfaces/bandeja.interface';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { VacationService } from '@pages/vacation/vacation.service';
import { MatAccordion } from '@angular/material/expansion'
import { Subscription, forkJoin, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UploadExcelVacationComponent } from '@pages/vacation/shared/upload-excel-vacation/upload-excel-vacation.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('listaPlazosTemplate') listaPlazosTemplate!: TemplateRef<any>;
  private _recordDownloadSub!: Subscription;
  showLoading = false;
  identificacion: any;
  usuario: IBandejaResponse = {} as IBandejaResponse;
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  SortType = SortType;
  rows = [];
  reorderable = true;
  ColumnMode = ColumnMode;


  filtros: any[] = [];
  public addFilterForm: FormGroup;
  selectable = true;
  removable = true;

  listaGerencias: IListaGerencias[] = [];
  listaModalidades: IListaModalidades[] = [];
  listaPeriodos: IListaPeriodos[] = [];

  columnas: any = [];

  filtrosReporte: IFiltrosReporte = {
    identificacion: "",
    apellidos: "",
    nombres: "",
    modalidad: "",
    gerencia: "",
    // periodo: "",
    fechaIngreso: "",
    // fechaVencimiento: ""
  };
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService, private datePipe: DatePipe,
    private route: ActivatedRoute, public dialog: MatDialog, private cookieService: CookieService, private formBuilder: FormBuilder,) {
    this.identificacion = +this.cookieService.get('identificacion');
    this.vacationService.identificationSubjectObsData = this.identificacion;

    this.addFilterForm = this.formBuilder.group({
      identificacion: ['', []],
      apellidos: ['', []],
      nombres: ['', []],
      fecha_Ingreso: ['', []],
      // fecha_Vencimiento: ['', []],
      gerencia: ['', []],
      modalidad: ['', []],
      // periodo: ['', []],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    let obs = this.bandejaService.postFiltroReporte(this.filtrosReporte).pipe(mergeMap(
      (lista) => {
        return forkJoin([
          of(lista),
          this.bandejaService.getCabeceraFiltros()
        ]);
      }
    ));

    obs.subscribe(
      {
        next: (result: any) => {
          const lista = result[0];
          const cabecera = result[1];
          this.rows = lista;

          this.listaGerencias = cabecera.listaGerencias;
          this.listaModalidades = cabecera.listaModalidades;
          this.listaPeriodos = cabecera.listaPeriodos;

          this.columnas = [
            { prop: 'identificacion', name: 'Identificacion', sortable: true },
            { prop: 'apellidos', name: 'Apellidos', sortable: true },
            { prop: 'nombres', name: 'Nombres', sortable: true },
            { prop: 'modalidad', name: 'Modalidad', sortable: true },
            { prop: 'fechaIngreso', name: 'Fecha de Ingreso', sortable: true },
            { prop: 'gerencia', name: 'Gerencia', sortable: true }
          ];
           this.listaPeriodos.map((m, i) => {
             this.columnas.push({ prop: `${i + 1}_${m.descPeriodo}s`, name: `${m.descPeriodo}`, sortable: true })
             this.columnas.push({ prop: `${i + 1}_fecVencimientos`, name: `Fecha de Vencimiento`, sortable: true })
             this.rows.map((r: any, y) => {
               r[`${i + 1}_${m.descPeriodo}s`] = r.listaPlazos[i].saldo ? r.listaPlazos[i].saldo : 0;
               r[`${i + 1}_fecVencimientos`] = r.listaPlazos[i].fecVencimiento ? r.listaPlazos[i].fecVencimiento : '';
             });
           });
          this.columnas.push({ prop: 'saldoVacacional', name: 'Saldo Vacacional', sortable: true });
          this.columnas.push({ prop: 'observacion', name: 'Observación', sortable: true });
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
        }
      }
    );
  }

  goRegister(): void {
    this.vacationService.userSubjectObsData = this.usuario;
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
  }

  openModal(): void {
  }

  solicitudesPendientes(): void {
    this.vacationService.identificationSubjectObsData = this.identificacion;
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlSolicitudesPendientes}`]);
  }

  filtrar(): void {
    if (this.addFilterForm.value.fecha_Ingreso && this.addFilterForm.value.fecha_Vencimiento) {
      if (this.addFilterForm.value.fecha_Ingreso > this.addFilterForm.value.fecha_Vencimiento) {
        Swal.fire(
          'Advertencia!',
          'Fecha de Inicio debe ser menor a Fecha Fin!',
          'info'
        );
        return;
      }
    }
    this.filtros = [];
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    const objSearch: IFiltrosReporte = {
      identificacion: this.addFilterForm.value.identificacion ? this.addFilterForm.value.identificacion : '',
      apellidos: this.addFilterForm.value.apellidos ? this.addFilterForm.value.apellidos : '',
      nombres: this.addFilterForm.value.nombres ? this.addFilterForm.value.nombres : '',
      modalidad: this.addFilterForm.value.modalidad.descripcion ? this.addFilterForm.value.modalidad.descripcion : '',
      gerencia: this.addFilterForm.value.gerencia.descripcion ? this.addFilterForm.value.gerencia.descripcion : '',
      // periodo: this.addFilterForm.value.periodo.descPeriodo ? this.addFilterForm.value.periodo.descPeriodo : '',
      fechaIngreso: this.addFilterForm.value.fecha_Ingreso ? this.datePipe.transform(this.addFilterForm.value.fecha_Ingreso, 'dd/MM/yyyy') : '',
      // fechaVencimiento: this.addFilterForm.value.fecha_Vencimiento ? this.datePipe.transform(this.addFilterForm.value.fecha_Vencimiento, 'dd/MM/yyyy') : ''
    }

    this.bandejaService.postFiltroReporte(objSearch).subscribe({
      next: (result: any) => {
        this.rows = result;
         this.listaPeriodos.map((m, i) => {
           this.rows.map((r: any, y) => {
             r[`${i + 1}_${m.descPeriodo}s`] = r.listaPlazos[i].saldo ? r.listaPlazos[i].saldo : 0;
             r[`${i + 1}_fecVencimientos`] = r.listaPlazos[i].fecVencimiento ? r.listaPlazos[i].fecVencimiento : '';
           });
         });
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });


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
          case 'identificacion':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key] });
            break;
          case 'nombres':
          case 'apellidos':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key].toUpperCase() });
            break;
          // case 'periodo':
          //   this.filtros.push({ id: key, name: this.addFilterForm.value[key].descPeriodo });
          //   break;
          case 'modalidad':
          case 'gerencia':
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

    const objSearch: IFiltrosReporte = {
      identificacion: this.addFilterForm.value.identificacion ? this.addFilterForm.value.identificacion : '',
      apellidos: this.addFilterForm.value.apellidos ? this.addFilterForm.value.apellidos : '',
      nombres: this.addFilterForm.value.nombres ? this.addFilterForm.value.nombres : '',
      modalidad: this.addFilterForm.value.modalidad.descripcion ? this.addFilterForm.value.modalidad.descripcion : '',
      gerencia: this.addFilterForm.value.gerencia.descripcion ? this.addFilterForm.value.gerencia.descripcion : '',
      // periodo: this.addFilterForm.value.periodo.descPeriodo ? this.addFilterForm.value.periodo.descPeriodo : '',
      fechaIngreso: this.addFilterForm.value.fecha_Ingreso ? this.datePipe.transform(this.addFilterForm.value.fecha_Ingreso, 'dd/MM/yyyy') : '',
      // fechaVencimiento: this.addFilterForm.value.fecha_Vencimiento ? this.datePipe.transform(this.addFilterForm.value.fecha_Vencimiento, 'dd/MM/yyyy') : ''
    }

    this._recordDownloadSub = this.bandejaService
      .retrieveExcelReport(
       objSearch,
        {}
      )
      .subscribe({
        next: (record: any) => {
          const blob = new Blob([record.body], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const element = document.createElement('a');
          element.setAttribute('download', 'reporte_saldos_vacacionales.xls');
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

  exportAsXLSX(): void {
    let arr: any = [];
    
    this.rows.map((r: any, y) => {
        const obj: any = {};
        obj.identificacion = r.identificacion;
        obj.apellidos = r.apellidos;
        obj.nombres = r.nombres;
        obj.modalidad = r.modalidad;
        obj.fechaIngreso = r.fechaIngreso;
        obj.gerencia = r.gerencia;
        // this.listaPeriodos.map((m, i) => {
        //   obj[`${m.descPeriodo}`] = r.listaPlazos[i].saldo ? r.listaPlazos[i].saldo : 0;
        //   obj[`FechaVencimiento_${m.descPeriodo}`] = r.listaPlazos[i].fecVencimiento ? r.listaPlazos[i].fecVencimiento : '';
        // });
        arr.push(obj);
      });

    this.vacationService.exportToExcel(arr, 'reporte');
  }

  goback(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
  }

  openModalExcel(): void {
    this.dialog.open(UploadExcelVacationComponent, {
      width: '650px',
      autoFocus: false,
      closeOnNavigation: true
    });
  }

}
