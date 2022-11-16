import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(private cookieService: CookieService, public router: Router) { }
    canActivate(): boolean {
        const token: string = this.cookieService.get('isLoggedIn');
        if (token) {
            this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
            return false;
        }
        return true;
    }
}