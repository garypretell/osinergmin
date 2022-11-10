import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ProtectedGuardService implements CanActivate {
    constructor(private cookieService: CookieService, public router: Router) { }
    canActivate(): boolean {
        const token: string = this.cookieService.get('isLoggedIn');
        if (!token) {
            this.router.navigateByUrl('/home');
            return false;
        }
        return true;
    }
}