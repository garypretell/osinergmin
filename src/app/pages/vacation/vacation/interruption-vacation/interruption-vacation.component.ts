import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { VacationService } from '../../vacation.service';

@Component({
  selector: 'app-interruption-vacation',
  templateUrl: './interruption-vacation.component.html',
  styleUrls: ['./interruption-vacation.component.scss']
})
export class InterruptionVacationComponent implements OnInit {
  detalle: any = {};
  constructor(private router: Router, private vacationService: VacationService) {
   }

  ngOnInit(): void {
    this.vacationService.vacationValue ? this.detalle = this.vacationService.vacationValue : this.goback();

  }

  goback(): void {
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.vacationService.identificationValue } });
  }

}