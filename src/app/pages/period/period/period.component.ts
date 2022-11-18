import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BandejaService } from '@shared/services/bandeja.service';
import { SortType, ColumnMode } from '@swimlane/ngx-datatable';
import { PeriodAddComponent } from '../shared/period-add/period-add.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IDatosRegistroResponse } from '@shared/models/common/interfaces/bandeja.interface';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

  SortType = SortType;
  reorderable = true;
  ColumnMode = ColumnMode;
  loadingIndicator = false;
  rows = [];
  columns = [
    { prop: 'codPeriodo', name: 'Cod. Periodo', sortable: true },
    { prop: 'descPeriodo', name: 'Desc. Periodo', sortable: true },
    { prop: 'saldo', name: 'Saldo', sortable: true },
    { prop: 'fechaPlazoVencimiento', name: 'Fecha Plazo Venc.', sortable: true },
    { prop: 'estado', name: 'Estado', sortable: true },
    { prop: 'actions', name: 'Acciones', sortable: true }
  ];

  filtros: any[] = [];
  public addFilterForm: FormGroup;
  selectable = true;
  removable = true;

  usuario: any = {};
  private unsubscribe$ = new Subject();
  constructor(private bandejaService: BandejaService, private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private vacationService: VacationService) {
    this.addFilterForm = this.formBuilder.group({
      codigo_Empleado: ['', []],
      apellidos: ['', []],
      nombres: ['', []],
      correo_Electronico: ['', []],
      tipo_Usuario: ['', []],
      estado: ['', []]
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    this.bandejaService.getListaPeriodo().subscribe({
      next: (result: any) => {
        this.rows = result;
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  deletePeriod(row: any): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    this.bandejaService.deletePeriodo({ codPeriodo: row.codPeriodo }).subscribe({
      next: (result: any) => {
        this.getData();
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  activePeriod(row: any): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    this.bandejaService.activePeriod({ codPeriodo: row.codPeriodo }).subscribe({
      next: (result: any) => {
        this.getData();
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  abrirDialogoCrear(nuevo: boolean, error: string): void {
    const period = {};
    const dialogo = this.dialog.open(PeriodAddComponent, {
      data: { period, tittle: 'Registrar Periodo', errorMssg: error, nuevo },
      width: '40vw',
      autoFocus: false,
    });

    dialogo.afterClosed().subscribe((periodC) => {
      if (periodC !== undefined) {
        this.agregar(periodC.period);
      }
    });
  }

  abrirDialogoActualizar(period: any, error: string, nuevo: boolean): void {
    console.log(period);
    const dialogo = this.dialog.open(PeriodAddComponent, {
      data: { period, tittle: 'Editar Periodo', errorMssg: error, nuevo },
      width: '40vw',
      autoFocus: false,
    });

    dialogo.afterClosed().subscribe((periodA) => {
      if (periodA !== undefined) {
        this.editar(periodA.period);
      }
    });
  }

  agregar(period: any): any {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.crearPeriodo(period).subscribe({
      next: (result: any) => {
        this.getData();
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  editar(period: any): any {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.actualizarPeriodo(period).subscribe({
      next: (result: any) => {
        this.getData();
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  goback(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
  }

  goHome(): void {
    this.dialog.closeAll();
    this.router.navigate([`${PATH_URL_DATA.urlHome}`]);
  }

}
