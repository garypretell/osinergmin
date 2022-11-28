import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BandejaService } from '@shared/services/bandeja.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { CookieService } from 'ngx-cookie-service';
import { async } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-pending',
  templateUrl: './request-pending.component.html',
  styleUrls: ['./request-pending.component.scss'],
})
export class RequestPendingComponent implements OnInit {
  identificacion: any;
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  SortType = SortType;
  rows: Array<any> = [];
  columns = [
    { name: 'codSolicitud', sortable: true },
    { name: 'nombreEmpleado', sortable: true },
    { name: 'init', sortable: true },
    { name: 'end', sortable: true },
    { name: 'days', sortable: true },
    { name: 'state', sortable: true },
    { name: 'nombreReemplazo', sortable: true },
    { name: 'action', sortable: true },
  ];
  filter = [
    { value:2, description: 'Pendiente de aprobación por el jefe inmediato' },
    { value:3, description: 'Pendiente de aprobación por grh' },
    { value:6, description: 'Devuelto por el jefe inmediato' }
  ];
  reorderable = true;
  ColumnMode = ColumnMode;
  estadoVacional = this.filter[0];
  constructor(
    private bandejaService: BandejaService,
    private router: Router,
    private vacationService: VacationService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cookieService: CookieService
  ) {
    this.identificacion = +this.cookieService.get('isLoggedIn');
  }

  selectFilter() {
    this.getData();
  }

  ngOnInit(): void {
    this.identificacion ? this.getData() : this.goBandeja();
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px',
      data: {},
      disableClose: true,
    });
    this.bandejaService
      .getListaSolicitudJefe({ identificacion: this.identificacion, estadoVacional: this.estadoVacional.value })
      .subscribe({
        next: (data: any) => {
          this.rows = data.solicitudesVacacionalesJefe;
          dialogRef.close();
        },
        error: (error) => {
          dialogRef.close();
          // handle error
        },
        complete: () => {
          console.log('Request complete');
        },
      });
  }

  goBandeja(): void {
    this.router.navigate(
      [`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]
    );
  }

  aprobar(row: any): void {
    let nombre_user='';
    this.vacationService.userSubjectObs.subscribe(data=>{
      nombre_user=data.nombres;
    });
     
    Swal.fire({
      title: `<p>¿Está seguro de aprobar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      // text: "No podrás revertir el proceso!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aprobar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px',
          data: {},
          disableClose: true,
        });
      
        this.bandejaService
          .postAprobar({
            identificacion: this.identificacion,
            nombres: nombre_user,
            codRegistro: row.codRegistro,
            codSolicitud: row.codSolicitud,
          })
          .subscribe({
            next: (response: any) => {
              dialogRef.close();
            },
            error: (error) => {
              dialogRef.close();
            },
            complete: () => {
              Swal.fire(
                `Solicitud: ${row.codSolicitud}`,
                'La solicitud ha sido aprobada.',
                'success'
              ).then(() => {
                this.getData();
              });
            },
          });
      }
    });
  }

  async rechazar(row: any): Promise<void> {
    let nombre_user='';
    this.vacationService.userSubjectObs.subscribe(data=>{
      nombre_user=data.nombres;
    });
    Swal.fire({
      title: `<p>¿Está seguro de rechazar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      html: `<div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">Motivo:</label>
              <textarea class="form-control" id="comentario" placeholder="Comentario" rows="3"></textarea>
            </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, rechazar!',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputElement = Swal.getPopup()?.querySelector('#comentario') as HTMLInputElement;
        const comentario: any = inputElement.value;
        if (!comentario ) {
          Swal.showValidationMessage(`Ingrese Motivo de rechazo`);
        }
        return { comentario }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px',
          data: {},
          disableClose: true,
        });
        this.bandejaService
          .postRechazar({
            identificacion: this.identificacion,
            nombres: nombre_user,
            codRegistro: row.codRegistro,
            codSolicitud: row.codSolicitud,
            motivo: result?.value?.comentario ? result?.value?.comentario : '',
          })
          .subscribe({
            next: (response: any) => {
              dialogRef.close();
            },
            error: (error) => {
              dialogRef.close();
            },
            complete: () => {
              Swal.fire(
                `Solicitud: ${row.codSolicitud}`,
                'La solicitud ha sido rechazada.',
                'success'
              ).then(() => {
                this.getData();
              });
            },
          });
      }
    });
  }

  goDetail(row: any) {
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate([`vacaciones/solicitudes-pendientes`, row.codSolicitud]);
  }

}
