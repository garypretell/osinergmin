import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faBell, faComment } from '@fortawesome/free-solid-svg-icons';
import { VacationService } from '@pages/vacation/vacation.service';
import { CookieService } from 'ngx-cookie-service';

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
  ) { }

  ngOnInit(): void {
  }

  async logout() {
    await new Promise((resolve, reject) => {
      try {
        this.cookieService.delete('isLoggedIn', '/')
        this.cookieService.delete('identificacion', '/')
        resolve(true)
      }
      catch (err) {
        reject(false)
      }

    }).then(() => {
      this.router.navigateByUrl('/home')
    })
  }
}
