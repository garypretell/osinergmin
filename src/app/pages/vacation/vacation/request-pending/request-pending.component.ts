import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BandejaService } from '@shared/services/bandeja.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-pending',
  templateUrl: './request-pending.component.html',
  styleUrls: ['./request-pending.component.scss']
})
export class RequestPendingComponent implements OnInit {
  identificacion: any;
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  SortType = SortType;
  rows: Array<any> = [];
  columns = [
    { name: 'nombreEmpleado', sortable: true },
    { name: 'init', sortable: true },
    { name: 'end', sortable: true },
    { name: 'days', sortable: true },
    { name: 'state', sortable: true },
    { name: 'nombreReemplazo', sortable: true },
    { name: 'action', sortable: true },
  ];
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService,
    private route: ActivatedRoute, public dialog: MatDialog, private cookieService: CookieService) { 
      this.identificacion =  this.vacationService.identificationValue;
    }

  ngOnInit(): void {
    this.identificacion ? this.getData() : this.goBandeja();
  }

  getData(): void {
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    this.bandejaService.getListaSolicitudJefe({ identificacion: this.identificacion }).subscribe({
      next: (data: any) => {
        this.rows = data.solicitudesVacacionalesJefe;
        dialogRef.close();
      },
      error: error => {
        dialogRef.close();
        // handle error
      },
      complete: () => {
        console.log('Request complete');
      }
    });
  }

  goBandeja(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.vacationService.identificationValue } });
  }

  ver(row: any): void {
    this.vacationService.vacationSubjectObsData = row;
    // this.vacationService.userSubjectObsData = this.identificacion;
    this.router.navigate([`vacaciones/solicitud`, row.codSolicitud]);
  }

  aprobar(row: any): void {
    Swal.fire({
      title: `<p>¿Está seguro de aprobar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      // text: "No podrás revertir el proceso!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aprobar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.postAprobar({
          identificacion: this.identificacion,
          nombres: row.nombres,
          codRegistro: row.codRegistro,
          codSolicitud: row.codSolicitud
        }).subscribe({
          next: (response: any) => { dialogRef.close(); },
          error: error => { dialogRef.close(); },
          complete: () => {
            Swal.fire(
              `Solicitud: ${row.codSolicitud}`,
              'La solicitud ha sido aprobada.',
              'success'
            ).then(() => {
              this.getData();
            });
          }
        });
      }
    })
  }

  async rechazar(row: any): Promise<void> {
    // const { value: text } = await Swal.fire({
    //   input: 'textarea',
    //   inputLabel: 'Message',
    //   inputPlaceholder: 'Type your message here...',
    //   inputAttributes: {
    //     'aria-label': 'Type your message here'
    //   },
    //   showCancelButton: true
    // }).then((result) => {
    //   console.log(result);
    //   return result;
    // });
    
    // if (text) {
    //   Swal.fire(text)
    // }
    Swal.fire({
      title: `<p>¿Está seguro de rechazar la solicitud</p><p>${row.codSolicitud} ?</p>`,
      // text: "No podrás revertir el proceso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, rechazar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.postRechazar({
          identificacion: this.identificacion,
          nombres: row.nombres,
          codRegistro: row.codRegistro,
          codSolicitud: row.codSolicitud
        }).subscribe({
          next: (response: any) => { dialogRef.close(); },
          error: error => { dialogRef.close(); },
          complete: () => {
            Swal.fire(
              `Solicitud: ${row.codSolicitud}`,
              'La solicitud ha sido rechazada.',
              'success'
            ).then(() => {
              this.getData();
            });
          }
        });
      }
    })
  }

}
