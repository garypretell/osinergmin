import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailVacationComponent } from './vacation/detail-vacation/detail-vacation.component';
import { InterruptionVacationComponent } from './vacation/interruption-vacation/interruption-vacation.component';
import { RegisterVacationComponent } from './vacation/register-vacation/register-vacation.component';
import { RescheduleVacationComponent } from './vacation/reschedule-vacation/reschedule-vacation.component';
import { VacationComponent } from './vacation/vacation.component';

const routes: Routes = [
  { path: '', redirectTo: 'bandeja', pathMatch: 'full'},
  { path: 'bandeja', component: VacationComponent },
  { path: 'registrar', component: RegisterVacationComponent },
  { path: 'solicitud/:solic', component: DetailVacationComponent, pathMatch: 'full' },
  { path: 'interrumpir-solicitud/:solic', component: InterruptionVacationComponent, pathMatch: 'full' },
  { path: 'reprogramar-solicitud/:solic', component: RescheduleVacationComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationRoutingModule { }
