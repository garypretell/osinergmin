import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadExcelVacationComponent } from '@pages/vacation/shared/upload-excel-vacation/upload-excel-vacation.component';
import { VacationService } from '@pages/vacation/vacation.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { BandejaService } from '@shared/services/bandeja.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(public dialog: MatDialog, private bandejaService: BandejaService, private router: Router, private formBuilder: FormBuilder,  public vacationService: VacationService, private cookieService: CookieService) {
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
    const dateNow = new Date();
    // dateNow.setDate(dateNow.getDate() + 1);
    dateNow.setHours(dateNow.getHours() + 1);
    // dateNow.setMinutes(dateNow.getMinutes() + 5);
    this.cookieService.set('isLoggedIn', this.formGroup.get('documento')?.value, dateNow);
      this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
      // this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.formGroup.get('documento')?.value } });
  }

  actualizar() {

    Swal.fire({
      title: `<p>¿Está seguro de actualizar saldo?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(LoaderComponent, {
          width: '400px', data: {}, disableClose: true
        });
        this.bandejaService.getActualizar().subscribe({
          next: (response: any) => {
            dialogRef.close();
          },
          error: error => { dialogRef.close(); },
        })
      }
    })
  }

  goUser(): void {
    this.router.navigate([`${PATH_URL_DATA.urlUsuarios}`]);
  }

  openModalExcel(): void {
    this.dialog.open(UploadExcelVacationComponent, {
      width: '650px',
      autoFocus: false,
      closeOnNavigation: true
    });
  }

}
