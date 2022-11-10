import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private cookieService: CookieService, private router: Router, private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = this.cookieService.get('isLoggedIn');

    let request = req;

    if (!token) {
      this.dialog.closeAll();
      const alert: any = {};
      alert.title = 'Alerta';
      alert.message = '¡Su sesion ha expirado!';

      const dialogRef = this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: alert }
      });
      dialogRef.afterClosed().subscribe(response => {
        this.router.navigateByUrl('/home');
        this.dialog.closeAll();
      });
    }

    return next.handle(request);
  }

}