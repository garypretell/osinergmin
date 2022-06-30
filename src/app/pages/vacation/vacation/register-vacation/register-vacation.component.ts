import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-vacation',
  templateUrl: './register-vacation.component.html',
  styleUrls: ['./register-vacation.component.scss']
})
export class RegisterVacationComponent implements OnInit {
  vacaciones: any = {};
  identificacion: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.identificacion = +this.route.snapshot.params['identify'];
   }

  ngOnInit(): void {
  }

  goBandeja(): void {
    this.router.navigate([`vacaciones/${this.identificacion}/bandeja`]);
  }

}
