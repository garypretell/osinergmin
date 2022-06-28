import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@NgModule({
  declarations: [
    VacationComponent,
    RegisterVacationComponent,
    DetailVacationComponent,
    RescheduleVacationComponent,
    InterruptionVacationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VacationRoutingModule,
    NgxDatatableModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class VacationModule { }
