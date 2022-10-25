import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BandejaService } from '@shared/services/bandeja.service';
import { SortType, ColumnMode } from '@swimlane/ngx-datatable';
import { UserAddComponent } from '../shared/user-add/user-add.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  SortType = SortType;
  reorderable = true;
  ColumnMode = ColumnMode;
  loadingIndicator = false;
  rows = [];
  columns = [
    { prop: 'codEmpl', name: 'Cod. Empleado', sortable: true },
    { prop: 'apeEmpl', name: 'Apellidos', sortable: true },
    { prop: 'nomEmpl', name: 'Nombres', sortable: true },
    { prop: 'boxMail', name: 'Correo Electronico', sortable: true },
    { prop: 'tipoUsuario', name: 'Tipo Usuario', sortable: true },
    { prop: 'codEstado', name: 'Estado', sortable: true },
    { prop: 'actions', name: 'Acciones', sortable: true }
  ];

  filtros: any[] = [];
  public addFilterForm: FormGroup;
  selectable = true;
  removable = true;
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

    this.bandejaService.getListaUsuario().subscribe({
      next: (result: any) => {
        this.rows = result;
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  deleteUser(row: any): void { 
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    this.bandejaService.deleteUsuario({codUsuario: row.codUsuario}).subscribe({
      next: (result: any) => {
        this.getData();
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  activeUser(row: any): void { 
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });

    this.bandejaService.activeUsuario({codUsuario: row.codUsuario}).subscribe({
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
    const user = {};
    const dialogo = this.dialog.open(UserAddComponent, {
      data: { user, tittle: 'Registrar Usuario', errorMssg: error, nuevo },
      width: '40vw',
      autoFocus: false,
    });

    dialogo.afterClosed().subscribe((userC) => {
      if (userC !== undefined) {
        this.agregar(userC.user);
      }
    });
  }

  abrirDialogoActualizar(user: any, error: string, nuevo: boolean): void {
    const dialogo = this.dialog.open(UserAddComponent, {
      data: { user, tittle: 'Editar Usuario', errorMssg: error, nuevo },
      width: '40vw',
      autoFocus: false,
    });

    dialogo.afterClosed().subscribe((userA) => {
      if (userA !== undefined) {
        this.editar(userA.user);
      }
    });
  }

  agregar(user: any): any {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.crearUsuario(user).subscribe({
      next: (result: any) => {
        this.getData();
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
      }
    });
  }

  editar(user: any): any {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.actualizarUsuario(user).subscribe({
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
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.vacationService.identificationValue } });
  }

}
