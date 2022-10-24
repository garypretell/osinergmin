import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

import { BandejaService } from '@shared/services/bandeja.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { IBandejaResponse, IFiltrosReporte, IFiltrosReporteSolicitudes, IListaEstadosVacionales, IListaGerencias, IListaModalidades, IListaPeriodos, IListaTipoGoceVacionales } from '@shared/models/common/interfaces/bandeja.interface';
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

@Component({
  selector: 'app-request-report',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.scss']
})
export class RequestReportComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('listaPlazosTemplate') listaPlazosTemplate!: TemplateRef<any>;
  @ViewChild('toppingTemplate') toppingTemplate!: TemplateRef<any>;
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

  listaTipoGoceVacionales: IListaTipoGoceVacionales[] = [];
  listaEstadosVacionales: IListaEstadosVacionales[] = [];


  columns: any = [
    { prop: 'codEmpl', name: 'Numero de documento', sortable: true },
    { prop: 'apellidos', name: 'Apellidos', sortable: true },
    { prop: 'nombres', name: 'Nombres', sortable: true },
    { prop: 'dias', name: 'Dias Tomados', sortable: true },
    { prop: 'fechaInicio', name: 'Fecha Inicio Vac.', sortable: true },
    { prop: 'fechaFin', name: 'Fecha Fin Vac.', sortable: true },
    { prop: 'codSolicitud', name: 'Numero Solicitud', sortable: true },
    { prop: 'descTipoGoce', name: 'Tipo Goce', sortable: true },
    { prop: 'desEstado', name: 'Estado', sortable: true },
    { prop:'actions', name: 'actions', sortable: true,  cellTemplate: this.toppingTemplate }
  ];

  filtrosReporte: IFiltrosReporteSolicitudes = {
    identificacion: "",
    apellidos: "",
    nombres: "",
    tipoGoce: "",
    tipoEstado: "",
    fechaInicio: "",
    fechaFin: "",
    codigoSolicitud: ""
};
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService, private datePipe: DatePipe,
    private route: ActivatedRoute, public dialog: MatDialog, private cookieService: CookieService, private formBuilder: FormBuilder,) {
    this.identificacion = +this.cookieService.get('identificacion');
    this.vacationService.identificationSubjectObsData = this.identificacion;

    this.addFilterForm = this.formBuilder.group({
      identificacion: ['', []],
      apellidos: ['', []],
      nombres: ['', []],
      tipo_Goce: ['', []],
      tipo_Estado: ['', []],
      fecha_Inicio: ['', []],
      fecha_Fin: ['', []],
      codigo_Solicitud: ['', []],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    let obs = this.bandejaService.postFiltroReporteSolicitudes(this.filtrosReporte).pipe(mergeMap(
      (lista) => {
        return forkJoin([
          of(lista),
          this.bandejaService.getCabeceraFiltrosSolicitudes()
        ]);
      }
    ));

    obs.subscribe(
      {
        next: (result: any) => {
          const lista = result[0];
          const cabecera = result[1];
          this.rows = lista;

          this.listaTipoGoceVacionales = cabecera.listaTipoGoceVacionales;
          this.listaEstadosVacionales = cabecera.listaEstadosVacionales;

          // this.columnas = 
          // this.columnas= this.columnas.concat(columnas);
          dialogRef.close();
        },
        error: error => {
          dialogRef.close();
        }
      }
    );
  }

  async setPage(pageInfo: any): Promise<any> { }

  async onSort(event: any): Promise<any> { }

  openModal(): void {
  }

  solicitudesPendientes(): void {
    this.vacationService.identificationSubjectObsData = this.identificacion;
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlSolicitudesPendientes}`]);
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
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    const objSearch: IFiltrosReporteSolicitudes = {
      identificacion: this.addFilterForm.value.identificacion ? this.addFilterForm.value.identificacion : '',
      apellidos: this.addFilterForm.value.apellidos ? this.addFilterForm.value.apellidos : '',
      nombres: this.addFilterForm.value.nombres ? this.addFilterForm.value.nombres : '',
      tipoGoce: this.addFilterForm.value.tipo_Goce.descTipoGoce ? this.addFilterForm.value.tipo_Goce.descTipoGoce : '',
      tipoEstado: this.addFilterForm.value.tipo_Estado.descEstadoVacacional ? this.addFilterForm.value.tipo_Estado.descEstadoVacacional : '',
      codigoSolicitud: this.addFilterForm.value.codigo_Solicitud ? this.addFilterForm.value.codigo_Solicitud : '',
      fechaInicio: this.addFilterForm.value.fecha_Inicio ?  this.datePipe.transform(this.addFilterForm.value.fecha_Inicio, 'dd/MM/yyyy')  : '',
      fechaFin: this.addFilterForm.value.fecha_Fin ? this.datePipe.transform(this.addFilterForm.value.fecha_Fin, 'dd/MM/yyyy') : ''
    }

    this.bandejaService.postFiltroReporteSolicitudes(objSearch).subscribe({
      next: (result: any) => {
        this.rows = result;
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
          case 'nombres':
          case 'apellidos':
          case 'codigo_Solicitud':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key] });
            break;
          case 'tipo_Goce':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key].descTipoGoce });
            break;
          case 'tipo_Estado':
            this.filtros.push({ id: key, name: this.addFilterForm.value[key].descEstadoVacacional });
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

  exportAsXLSX(): void {
    let arr: any = [];
    
    this.rows.map((r: any, y) => {
        const obj: any = {};
        obj.numero_documento = r.codEmpl;
        obj.apellidos = r.apellidos;
        obj.nombres = r.nombres;
        obj.dias_tomados = r.dias;
        obj.fecha_inicio = r.fechaInicio;
        obj.fecha_fin = r.fechaFin;
        obj.numero_solicitud = r.codSolicitud;
        obj.tipo_goce = r.descTipoGoce;
        obj.estado = r.desEstado;
        arr.push(obj);
      });

    this.vacationService.exportToExcel(arr, 'reporte');
  }

}
