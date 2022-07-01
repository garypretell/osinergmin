import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { VacationService } from '../vacation.service';
import { BandejaService } from '@shared/services/bandeja.service';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { IBandejaResponse, ISolicitud } from '@shared/models/common/interfaces/bandeja.interface';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.scss']
})
export class VacationComponent implements OnInit, AfterViewInit {
  identificacion: any;
  usuario: IBandejaResponse = {} as IBandejaResponse;
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  sortData = { place: 1, volume: 1 };
  sortOrder = [{ prop: 'place', dir: 'asc' }, { prop: 'volume', dir: 'asc' }];
  rows: Array<ISolicitud> = [];
  columns = [
    { name: 'created', sortable: false },
    { name: 'code', sortable: false },
    { name: 'type', sortable: false },
    { name: 'init', sortable: false },
    { name: 'end', sortable: false },
    { name: 'days', sortable: false },
    { name: 'state', sortable: false },
    { name: 'action', sortable: false },
  ];
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor(private bandejaService: BandejaService, private router: Router, private vacationService: VacationService, private route: ActivatedRoute) {
    this.identificacion = +this.route.snapshot.queryParams['id'];
    this.vacationService.identificationSubjectObsData = this.identificacion;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"]'))
        .forEach(tooltipNode => new bootstrap.Tooltip(tooltipNode, {
          container: 'body',
          trigger: 'hover'
        }))
    }, 100);
  }

  ngOnInit(): void {
    this.bandejaService.getBandeja({ identificacion: this.identificacion }).subscribe({
      next: (user: IBandejaResponse) => {
        this.usuario = user;
        this.rows = user.solicitudesVacacionales;
      },
      error: error => {
        // handle error
      },
      complete: () => {
        console.log('Request complete');
      }
    });

  }

  goRegister(): void {
    this.router.navigate([`vacaciones/registrar`]);
  }

  async setPage(pageInfo: any): Promise<any> { }

  async onSort(event: any): Promise<any> { }

  goDetail(row: any) {
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate([`vacaciones/solicitud`, row.codSolicitud]);

  }

  anular(row: any): void {
    Swal.fire({
      title: `¿Está seguro de anular la solicitud ${row.codSolicitud}?`,
      // text: "No podrás revertir el proceso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rows = this.rows.filter(item => item.codSolicitud !== row.codSolicitud);
        Swal.fire(
          'Eliminado!',
          'La solicitud ha sido eliminada.',
          'success'
        )
      }
    })
  }

  reprogramar(row: any): void {
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate([`vacaciones/reprogramar-solicitud`, row.codSolicitud]);
  }

  interrumpir(row: any): void {
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate([`vacaciones/interrumpir-solicitud`, row.codSolicitud]);
  }

}
