import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faBell, faComment } from '@fortawesome/free-solid-svg-icons';
import { VacationService } from '@pages/vacation/vacation.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() showMenu = new EventEmitter<any>();
  public faBars = faBars;
  public faBell = faBell;
  public faComment = faComment;
  public avatar = 'assets/images/avatar.jpg';
  public logo = 'assets/images/osinermin.png';
  constructor(
    private router: Router, public vacationService: VacationService, private cookieService: CookieService
  ) {
    // this.checkToken();
  }

  ngOnInit(): void {
  }

  private checkToken(): void {

    // const isExpired = this.cookieService.get('isLoggedIn') || null;
    // if (isExpired) {
    //   this.logOut();
    // }
  }

  public logOut(): any {
    this.cookieService.delete('isLoggedIn', '/')
    this.cookieService.delete('identificacion', '/')
    this.cookieService.deleteAll();
    this.router.navigate(['/home']);
  }

  logout() {
    Swal.fire({
      title: 'Esta seguro de cerrar la sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesion',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.logOut();
      }
    })
  }
}
