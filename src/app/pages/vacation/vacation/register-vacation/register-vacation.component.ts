import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';

@Component({
  selector: 'app-register-vacation',
  templateUrl: './register-vacation.component.html',
  styleUrls: ['./register-vacation.component.scss']
})
export class RegisterVacationComponent implements OnInit {
  vacaciones: any = {};
  constructor(private router: Router, private vacationService: VacationService) { }

  ngOnInit(): void {
  }

  goBandeja(): void {
    this.router.navigate([`vacaciones/bandeja`], { queryParams: { id: this.vacationService.identificationValue } });
  }

}
