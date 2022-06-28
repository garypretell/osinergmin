import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ALERT_MESSAGES, ALERT_TYPE } from "@shared/helpers";
import { AlertComponent } from "./alert.component";

@Injectable({ providedIn: 'root' })

export class AlertService {

  constructor(private dialog: MatDialog) { }

        // Mostrar modal de alerta
    openModalFileError(message: string) {
      let alert = ALERT_MESSAGES.filter(obj => obj.type == ALERT_TYPE.custom)[0];
      alert.title = 'Alerta';
      alert.message = message;

      const dialogRef = this.dialog.open(AlertComponent, {
        width: '400px', data: { alert: alert }
      });

      dialogRef.afterClosed().subscribe(result => {});
    }

  }
