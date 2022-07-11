import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaService } from '@shared/services/bandeja.service';

@Component({
  selector: 'app-deadlines-vacation',
  templateUrl: './deadlines-vacation.component.html',
  styleUrls: ['./deadlines-vacation.component.scss']
})
export class DeadlinesVacationComponent implements OnInit {
  saldos: any;
  spinner = true;
  constructor(public dialogRef: MatDialogRef<DeadlinesVacationComponent>, private bandejaService: BandejaService,
    @ Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.bandejaService.getPlazos({ codSaldo: this.data.saldo.codSaldo }).subscribe({
      next: (row: any) => {
        this.saldos = row;
        this.spinner = false;
      },
      error: error => {
        // handle error
        this.spinner = false;
      },
      complete: () => {
        console.log('Request complete');
      }
    });
  }

}
