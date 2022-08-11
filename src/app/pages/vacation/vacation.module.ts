import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core'

import { VacationRoutingModule } from './vacation-routing.module';
import { VacationComponent } from './vacation/vacation.component';
import { RegisterVacationComponent } from './vacation/register-vacation/register-vacation.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTabsModule } from '@angular/material/tabs';
import { DetailVacationComponent } from './vacation/detail-vacation/detail-vacation.component';
import { RescheduleVacationComponent } from './vacation/reschedule-vacation/reschedule-vacation.component';
import { InterruptionVacationComponent } from './vacation/interruption-vacation/interruption-vacation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeadlinesVacationComponent } from './shared/deadlines-vacation/deadlines-vacation.component';
import { SharedModule } from '@shared/shared.module';
import { RequestPendingComponent } from './vacation/request-pending/request-pending.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ReportComponent } from './vacation/report/report.component';
import { RequestPendingDetailComponent } from './vacation/request-pending/request-pending-detail/request-pending-detail.component';
import { RequestPendingGrhComponent } from './vacation/request-pending-grh/request-pending-grh.component';
import { RequestPendingGrhDetailComponent } from './vacation/request-pending-grh/request-pending-grh-detail/request-pending-grh-detail.component';

@NgModule({
  declarations: [
    VacationComponent,
    RegisterVacationComponent,
    DetailVacationComponent,
    RescheduleVacationComponent,
    InterruptionVacationComponent,
    DeadlinesVacationComponent,
    RequestPendingComponent,
    ReportComponent,
    RequestPendingDetailComponent,
    RequestPendingGrhComponent,
    RequestPendingGrhDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VacationRoutingModule,
    NgxDatatableModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class VacationModule { }
