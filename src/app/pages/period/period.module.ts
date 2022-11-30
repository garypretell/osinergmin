import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PeriodComponent } from './period/period.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SharedModule } from '@shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/material.module';
import { PeriodRoutingModule } from './period-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PeriodAddComponent } from './shared/period-add/period-add.component';


@NgModule({
  declarations: [
    PeriodComponent,
    PeriodAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PeriodRoutingModule,
    NgxDatatableModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class PeriodModule { }
