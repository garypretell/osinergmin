import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
    userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    vacationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    identificationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private observer: BreakpointObserver) {}

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
}