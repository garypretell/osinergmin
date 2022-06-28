import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { VacationService } from '../vacation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.scss']
})
export class VacationComponent implements OnInit {
  episodio: any = {};
  usuario: any = {};
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  sortData = {place: 1, volume: 1};
  sortOrder = [{ prop: 'place', dir: 'asc' }, { prop: 'volume', dir: 'asc' }];
  rows = [
    { created: '01/03/2022 00:00', code: 'SV-GSTI-00025-2022', type: 'Goce Efectivo', init: '03/03/2022', end: '05/03/2022', days: 2, state: 3 },
    { created: '01/04/2022 00:00', code: 'SV-GSTI-00026-2022', type: 'Reprogramación', init: '03/04/2022', end: '05/04/2022', days: 3, state: 3 },
    { created: '01/05/2022 00:00', code: 'SV-GSTI-00027-2022', type: 'Interrupción', init: '03/05/2022', end: '05/05/2022', days: 1, state: 3 },

  ];
  columns = [
    { name: 'created', sortable: false },
    { name: 'code', sortable: false},
    { name: 'type', sortable: false },
    { name: 'init', sortable: false },
    { name: 'end', sortable: false },
    { name: 'days', sortable: false },
    { name: 'state', sortable: false },
    { name: 'action', sortable: false },
  ];
  reorderable = true;
  ColumnMode = ColumnMode;
  isBelowMd = true;
  initialSize = 0;
  columnSize  = [ 20, 20, 23, 25, 25, 12 ];

  value = 'Clear me';
  constructor(private userService: UserService, private router: Router, private vacationService: VacationService) { }

  ngOnInit(): void {
    this.userService.getUser({ identificacion: "111" }).subscribe((data: any) => {
      console.log(data);
      this.episodio = data;
      this.usuario = data;
    });
  }

  goRegister(): void {
    this.router.navigate(['vacaciones/registrar']);
  }

  async setPage(pageInfo: any): Promise<any> {}

  async onSort(event: any): Promise<any> {}

  goDetail(row: any) {
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate(['vacaciones/solicitud', row.code]);
  }

  anular(row: any): void {
    Swal.fire({
      title: `¿Está seguro de anular la solicitud ${row.code}?`,
      // text: "No podrás revertir el proceso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rows = this.rows.filter(item => item.code !== row.code);
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
    this.router.navigate(['vacaciones/reprogramar-solicitud', row.code]);
  }

  interrumpir(row: any): void {
    this.vacationService.vacationSubjectObsData = row;
    this.router.navigate(['vacaciones/interrumpir-solicitud', row.code]);
  }

}
