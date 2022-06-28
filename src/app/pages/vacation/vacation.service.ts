import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
    vacationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private observer: BreakpointObserver) {}

  get vacationValue(): any {
    return this.vacationSubject.value;
  }

  get vacationSubjectObs(): Observable<any> {
    return this.vacationSubject.asObservable();
  }

  set vacationSubjectObsData(data: any) {
    this.vacationSubject.next(data);
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