import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';


import { IAlerta } from '@shared/models/common/interfaces/alert.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {
  alert!: IAlerta;

  constructor(public dialogRef: MatDialogRef<AlertComponent>, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService) { }

  ngOnInit() {
    this.alert = this.data.alert;
  }

  async salir() {
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
      this.dialogRef.close();
      this.router.navigateByUrl('/home')
    })
  }

}