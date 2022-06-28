import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { AlertComponent } from '@shared/components/alert/alert.component';

import { ALERT_MESSAGES, ALERT_TYPE } from '@shared/helpers';
import { environment } from '@environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if(err.status == 401 || err.status == 403) window.location.href = environment.urlHome;
            if(err.status == 409 && err.error.codRpta == '-1') return of(err.error);
            if(err.error.code == 400 ) {
                console.log(err)
                let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
                alert.title = 'Alerta';
                alert.message = err.error.message;

                const dialogRef = this.dialog.open(AlertComponent, {
                    width: '400px', data: { alert: alert }
                });
            }
            else this.openModalError();
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    // Mostrar modal de alerta
    openModalError() {
        let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
        alert.title = 'Alerta';
        alert.message = 'Hubo un problema al ejecutar su operación.';
    
        const dialogRef = this.dialog.open(AlertComponent, { 
            width: '400px', data: { alert: alert } 
        });
    }
}