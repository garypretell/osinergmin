import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationService } from '../../vacation.service';

@Component({
  selector: 'app-reschedule-vacation',
  templateUrl: './reschedule-vacation.component.html',
  styleUrls: ['./reschedule-vacation.component.scss']
})
export class RescheduleVacationComponent implements OnInit {
  detalle: any = {};
  constructor(private router: Router, private vacationService: VacationService) {
   }

  ngOnInit(): void {
    this.vacationService.vacationValue ? this.detalle = this.vacationService.vacationValue : this.goback();

  }

  goback(): void {
    this.router.navigate([`vacaciones/bandeja`], { queryParams: { id: this.vacationService.identificationValue } });
  }

}
