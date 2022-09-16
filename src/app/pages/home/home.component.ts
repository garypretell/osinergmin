import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { PATH_URL_DATA } from '@shared/constants/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder,  public vacationService: VacationService) {
    this.formGroup = new FormGroup({
      'documento':new FormControl(null,[Validators.required])
    });
   }
  ngOnInit(): void {
    this.vacationService.userSubject.next(null);
  }

   getErrorDocument() {
    return this.formGroup.get('documento')?.hasError('required') ? 'Campo es requirido' : '';
  }

  goVacation() {
      this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.formGroup.get('documento')?.value } });
  }

}
