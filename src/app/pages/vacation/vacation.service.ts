import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset= UTF-8';
const EXCEL_EXT = '.xlsx'


@Injectable({
  providedIn: 'root',
})
export class VacationService {
    userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    vacationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    identificationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private router: Router, private observer: BreakpointObserver, private cookieService: CookieService,) {
    this.checkToken();
  }

  get userValue(): any {
    return this.userSubject.value;
  }

  get userSubjectObs(): Observable<any> {
    return this.userSubject.asObservable();
  }

  set userSubjectObsData(data: any) {
    this.userSubject.next(data);
  }

  get vacationValue(): any {
    return this.vacationSubject.value;
  }

  get vacationSubjectObs(): Observable<any> {
    return this.vacationSubject.asObservable();
  }

  set vacationSubjectObsData(data: any) {
    this.vacationSubject.next(data);
  }

  get identificationValue(): any {
    return this.identificationSubject.value;
  }

  get identificationSubjectObs(): Observable<any> {
    return this.identificationSubject.asObservable();
  }

  set identificationSubjectObsData(data: any) {
    this.identificationSubject.next(data);
  }

  isBelowSm(): Observable<BreakpointState> {
    return this.observer.observe(['(max-width: 575px)']);
  }

  isBelowMd(): Observable<BreakpointState> {
    return this.observer.observe(['(max-width: 767px)']);
  }

  isBelowLg(): Observable<BreakpointState> {
    return this.observer.observe(['(max-width: 991px)']);
  }

  isBelowXl(): Observable<BreakpointState> {
    return this.observer.observe(['(max-width: 1199px)']);
  }

  exportToExcel(json: any[], excelFileName: string): void {

    // var Heading =[
    //   [ "EMPLOYEE","SCORES","COMMENTS"]  
    // ];
      
    // const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.emp ,{skipHeader:true});
    // XLSX.utils.sheet_add_json(myworksheet,this.emp,{skipHeader:true , origin: 'A2'});
    // XLSX.utils.sheet_add_aoa(myworksheet, Heading);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.sheet_add_json(worksheet, json, {skipHeader:true , origin: 'A2'});
    const workbook: XLSX.WorkBook = {
      Sheets: {'data': worksheet},
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcel(excelBuffer, excelFileName);

  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob =  new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + Date.now() + EXCEL_EXT);
  }

  public checkToken(): void {

      const token = this.cookieService.get('token');

      if (!token) {
        this.cookieService.deleteAll();
        this.router.navigate(['/home']);
      }
    }
}