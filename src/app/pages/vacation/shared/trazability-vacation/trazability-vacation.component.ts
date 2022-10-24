import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaService } from '@shared/services/bandeja.service';

@Component({
  selector: 'app-trazability-vacation',
  templateUrl: './trazability-vacation.component.html',
  styleUrls: ['./trazability-vacation.component.scss']
})
export class TrazabilityVacationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TrazabilityVacationComponent>, private bandejaService: BandejaService,
    @ Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
