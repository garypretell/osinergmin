import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';

import { DetailVacationComponent } from './vacation/detail-vacation/detail-vacation.component';
import { InterruptionVacationComponent } from './vacation/interruption-vacation/interruption-vacation.component';
import { RegisterVacationComponent } from './vacation/register-vacation/register-vacation.component';
import { ReportComponent } from './vacation/report/report.component';
import { RequestPendingGrhDetailComponent } from './vacation/request-pending-grh/request-pending-grh-detail/request-pending-grh-detail.component';
import { RequestPendingGrhComponent } from './vacation/request-pending-grh/request-pending-grh.component';
import { RequestPendingDetailComponent } from './vacation/request-pending/request-pending-detail/request-pending-detail.component';
import { RequestPendingComponent } from './vacation/request-pending/request-pending.component';
import { RescheduleVacationComponent } from './vacation/reschedule-vacation/reschedule-vacation.component';
import { VacationComponent } from './vacation/vacation.component';

const routes: Routes = [
  { path: '', redirectTo: PATH_URL_DATA.urlBandejaVacaciones , pathMatch: 'full'},
  { path: PATH_URL_DATA.urlBandejaVacaciones, component: VacationComponent },
  { path: PATH_URL_DATA.urlRegistrarVacaciones, component: RegisterVacationComponent },
  { path: PATH_URL_DATA.urlDetalleVacaciones, component: DetailVacationComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlInterrupcionVacaciones, component: InterruptionVacationComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlReprogramarVacaciones, component: RescheduleVacationComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlSolicitudesPendientes, component: RequestPendingComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlSolicitudesPendientesDetalle, component: RequestPendingDetailComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlSolicitudesPendientesGrh, component: RequestPendingGrhComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlSolicitudesPendientesDetalleGrh, component: RequestPendingGrhDetailComponent, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlReporte, component: ReportComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationRoutingModule { }
