import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VacationService } from '@pages/vacation/vacation.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {
  message!: any;
  datos!: any;
  rows = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private vacationService: VacationService) { }

  ngOnInit() {
    this.message = this.data.message;
    this.datos = this.data.data;
    this.rows = this.message.identificadores;
  }

  exportAsXLSX(): void {
    let arr: any = [];

    this.rows.map((r: any, y) => {
      const obj: any = {};
      obj.identificador = r;
    console.log(obj.identificador);
      arr.push(obj);
    });

    this.vacationService.exportToExcel(arr, 'reporte_no_cargados_');
  }

}