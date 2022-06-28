import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-vacation',
  templateUrl: './register-vacation.component.html',
  styleUrls: ['./register-vacation.component.scss']
})
export class RegisterVacationComponent implements OnInit {
  vacaciones: any = {};
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBandeja(): void {
    this.router.navigate(['vacaciones/bandeja']);
  }

}
