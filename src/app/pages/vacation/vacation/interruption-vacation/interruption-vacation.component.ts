import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationService } from '../../vacation.service';

@Component({
  selector: 'app-interruption-vacation',
  templateUrl: './interruption-vacation.component.html',
  styleUrls: ['./interruption-vacation.component.scss']
})
export class InterruptionVacationComponent implements OnInit {
  detalle: any = {};
  identificacion: any;
  constructor(private router: Router, private vacationService: VacationService, private route: ActivatedRoute) {
    this.identificacion = +this.route.snapshot.params['identify'];
   }

  ngOnInit(): void {
    this.vacationService.vacationValue ? this.detalle = this.vacationService.vacationValue : this.goback();

  }

  goback(): void {
    this.router.navigate([`vacaciones/${this.identificacion}/bandeja`]);
  }

}