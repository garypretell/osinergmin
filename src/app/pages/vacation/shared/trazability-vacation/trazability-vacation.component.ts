import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaService } from '@shared/services/bandeja.service';

@Component({
  selector: 'app-trazability-vacation',
  templateUrl: './trazability-vacation.component.html',
  styleUrls: ['./trazability-vacation.component.scss']
})
export class TrazabilityVacationComponent implements OnInit {
  test: any;

  constructor(public dialogRef: MatDialogRef<TrazabilityVacationComponent>, private bandejaService: BandejaService,
    @ Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.test = this.data[0].codSolicitud.toString().split('a partir')[0];
    console.log(this.data);
  }

}
