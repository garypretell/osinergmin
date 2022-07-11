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

@NgModule({
  declarations: [
    VacationComponent,
    RegisterVacationComponent,
    DetailVacationComponent,
    RescheduleVacationComponent,
    InterruptionVacationComponent,
    DeadlinesVacationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VacationRoutingModule,
    NgxDatatableModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class VacationModule { }
