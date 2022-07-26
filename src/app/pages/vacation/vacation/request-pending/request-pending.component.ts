import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-request-pending',
  templateUrl: './request-pending.component.html',
  styleUrls: ['./request-pending.component.scss']
})
export class RequestPendingComponent implements OnInit {
  cantidad: any;
  pageNumber: any = 0;
  loadingIndicator = false;
  SortType = SortType;
  rows: Array<any> = [];
  columns = [
    { name: 'worker', sortable: true },
    { name: 'init', sortable: true },
    { name: 'end', sortable: true },
    { name: 'days', sortable: true },
    { name: 'state', sortable: true },
    { name: 'reemplazable', sortable: true },
    { name: 'action', sortable: true },
  ];
  reorderable = true;
  ColumnMode = ColumnMode;
  constructor(private router: Router, private vacationService: VacationService) { }

  ngOnInit(): void {
  }

  goBandeja(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.vacationService.identificationValue } });
  }

}
