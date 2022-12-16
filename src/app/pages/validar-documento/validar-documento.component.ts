import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationService } from '@pages/vacation/vacation.service';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-validar-documento',
  templateUrl: './validar-documento.component.html',
  styleUrls: ['./validar-documento.component.scss']
})
export class ValidarDocumentoComponent implements OnInit {
  documento: any
  constructor(private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private vacationService: VacationService) {
    const documento = this.route.snapshot.params['documento'];
    this.documento = documento
   }
  ngOnInit(): void {
    this.vacationService.userSubject.next(null);
    this.goVacation();
  }

  goVacation() {
    const dateNow = new Date();
    // dateNow.setDate(dateNow.getDate() + 1);
    dateNow.setHours(dateNow.getHours() + 1);
    // dateNow.setMinutes(dateNow.getMinutes() + 5);
    this.cookieService.set('isLoggedIn', this.documento, dateNow);
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
      // this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`], { queryParams: { id: this.formGroup.get('documento')?.value } });
  }

}
